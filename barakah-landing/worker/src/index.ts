// POST /api/lead          -> validate, store optional Loan Estimate in private R2, write to GoHighLevel
// GET  /api/estimate/:key -> serve a stored Loan Estimate to someone holding a valid, unexpired signed link
// Everything else          -> static site (Workers static assets)
import type { Env } from './env';
import { parseRequest, BadRequest, type Lead } from './validate';
import { Ghl, GhlError } from './ghl';
import { signLink, verifyLink } from './links';
import { CONSENT_VERSION } from './consent';

const PROGRAM_TAG: Record<string, string> = {
  murabaha: 'program:murabaha',
  musharakah: 'program:musharakah',
  ijara: 'program:ijara',
  'not-sure': 'program:not-sure'
};
const PROGRAM_NAME: Record<string, string> = {
  murabaha: 'Cost plus Profit (Murabaha)',
  musharakah: 'Diminishing Partnership (Musharakah)',
  ijara: 'Home Earned Equity (Ijara)',
  'not-sure': 'Not sure yet'
};

const json = (body: unknown, status = 200, extra: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra }
  });

/** Structured log with no personal data: no names, phone, email, IP or amounts. */
function log(event: string, data: Record<string, string | number | boolean> = {}) {
  console.log(JSON.stringify({ event, ...data }));
}

export function buildTags(lead: Lead, hasEstimate: boolean): string[] {
  const tags = ['barakah-lp', `goal:${lead.goal}`, ...lead.programs.map((p) => PROGRAM_TAG[p]), `has-estimate:${hasEstimate ? 'yes' : 'no'}`];
  if (!hasEstimate) tags.push('needs-qualification-review');
  if (lead.waitlist) tags.push('state:other-waitlist');
  if (lead.consent.email.granted) tags.push('consent:email');
  if (lead.consent.callsTexts.granted) tags.push('consent:calls-texts');
  return tags;
}

export function consentField(rec: Lead['consent']['email'], ctx: { at: string; ip: string; ua: string; pageUrl: string }) {
  return JSON.stringify({
    granted: rec.granted,
    timestamp: ctx.at,
    pageUrl: ctx.pageUrl,
    ip: ctx.ip,
    userAgent: ctx.ua,
    consentVersion: CONSENT_VERSION,
    textShown: rec.textShown,
    textMatchesServer: rec.textMatchesServer
  });
}

function originAllowed(req: Request, env: Env) {
  const origin = req.headers.get('origin');
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return Boolean(origin && allowed.includes(origin));
}

async function handleLead(req: Request, env: Env, fetchImpl: typeof fetch): Promise<Response> {
  if (!originAllowed(req, env)) return json({ ok: false, error: 'forbidden' }, 403);

  const ip = req.headers.get('cf-connecting-ip') || '';
  if (env.LEAD_LIMITER) {
    const { success } = await env.LEAD_LIMITER.limit({ key: ip || 'unknown' });
    if (!success) {
      log('lead_rate_limited');
      return json({ ok: false, error: 'rate_limited' }, 429, { 'retry-after': '60' });
    }
  }

  let parsed;
  try {
    parsed = await parseRequest(req, env.UPLOADS_ENABLED === 'true');
  } catch (e) {
    if (e instanceof BadRequest) {
      log('lead_rejected', { code: e.code });
      return json({ ok: false, error: e.code }, e.status);
    }
    throw e;
  }
  if (parsed.spam) {
    log('lead_spam_dropped');
    return json({ ok: true });
  }
  const lead = parsed.lead!;
  const at = new Date().toISOString();
  const ghl = new Ghl(env.GHL_TOKEN, fetchImpl);

  // 1. Store the Loan Estimate privately (R2 encrypts at rest). Random key, no PII in it.
  let objectKey: string | null = null;
  if (parsed.file) {
    objectKey = `le/${crypto.randomUUID()}.${parsed.file.kind === 'jpeg' ? 'jpg' : parsed.file.kind}`;
    await env.ESTIMATES.put(objectKey, parsed.file.bytes, {
      httpMetadata: { contentType: parsed.file.contentType },
      customMetadata: { uploadedAt: at }
    });
  }

  // 2. Upsert the contact.
  const ctx = { at, ip, ua: (req.headers.get('user-agent') || '').slice(0, 300), pageUrl: lead.pageUrl };
  const dndSettings: Record<string, { status: 'inactive'; message: string }> = {};
  const permitted = `Consent given on Barakah landing page ${at}`;
  if (lead.consent.email.granted) dndSettings.email = { status: 'inactive', message: permitted };
  if (lead.consent.callsTexts.granted && lead.phone) {
    dndSettings.call = { status: 'inactive', message: permitted };
    dndSettings.sms = { status: 'inactive', message: permitted };
  }

  let contactId: string;
  try {
    const up = await ghl.upsertContact({
      locationId: env.GHL_LOCATION_ID,
      firstName: lead.firstName,
      lastName: lead.lastName || undefined,
      name: [lead.firstName, lead.lastName].filter(Boolean).join(' '),
      ...(lead.email ? { email: lead.email } : {}),
      ...(lead.phone ? { phone: lead.phone } : {}),
      ...(lead.waitlist ? {} : { state: lead.state }),
      country: 'US',
      source: 'Barakah landing page',
      ...(Object.keys(dndSettings).length ? { dndSettings } : {}),
      customFields: [
        { id: env.GHL_CF_LANGUAGE, field_value: lead.language },
        { id: env.GHL_CF_CONSENT_EMAIL, field_value: consentField(lead.consent.email, ctx) },
        { id: env.GHL_CF_CONSENT_CALLS, field_value: consentField(lead.consent.callsTexts, ctx) },
        { id: env.GHL_CF_ATTRIBUTION, field_value: JSON.stringify({ pageUrl: lead.pageUrl, ...lead.utm }) }
      ]
    });
    contactId = up.contact?.id || '';
    if (!contactId) throw new GhlError('upsert', 502);
  } catch (e) {
    // Nothing usable was created: do not keep an orphaned document.
    if (objectKey) await env.ESTIMATES.delete(objectKey).catch(() => {});
    log('lead_failed', { step: e instanceof GhlError ? e.step : 'upsert', status: e instanceof GhlError ? e.status : 0 });
    return json({ ok: false, error: 'server' }, 502);
  }

  // 3. Tags, opportunity and note. The contact exists now, so a failure here is logged, not returned.
  const followUps: Array<[string, () => Promise<unknown>]> = [
    ['tags', () => ghl.addTags(contactId, buildTags(lead, Boolean(objectKey) || lead.estimateAttachedNotSent))]
  ];
  if (!lead.waitlist) {
    followUps.push([
      'opportunity',
      () =>
        ghl.createOpportunity({
          locationId: env.GHL_LOCATION_ID,
          pipelineId: env.GHL_PIPELINE_ID,
          pipelineStageId: env.GHL_STAGE_ID,
          contactId,
          name: `Barakah LP: ${[lead.firstName, lead.lastName].filter(Boolean).join(' ')} (${lead.goal === 'buy' ? 'Buy' : 'Refinance'})`,
          status: 'open',
          source: 'Barakah landing page'
        })
    ]);
  }
  const ttlH = Number(env.ESTIMATE_LINK_TTL_HOURS || 72);
  const link = objectKey
    ? await signLink(new URL(req.url).origin, objectKey, Math.floor(Date.now() / 1000) + ttlH * 3600, env.ESTIMATE_LINK_SECRET)
    : null;
  const note = [
    'Barakah landing page request',
    `Goal: ${lead.goal === 'buy' ? 'Buy a home' : 'Refinance'}`,
    `Programs: ${lead.programs.map((p) => PROGRAM_NAME[p]).join(', ')}`,
    `State: ${lead.waitlist ? 'Other (waitlist, not licensed)' : lead.state}`,
    `Language: ${lead.language}`,
    `Marketing email consent: ${lead.consent.email.granted ? 'yes' : 'no'}`,
    `Calls/texts consent: ${lead.consent.callsTexts.granted ? 'yes' : 'no'}`,
    link
      ? `Loan Estimate (private link, expires in ${ttlH} hours): ${link}`
      : lead.estimateAttachedNotSent
        ? 'Has a Loan Estimate (attached on the page, not uploaded while uploads are off). Ask them to bring it to the call.'
        : lead.noEstimateClicked
        ? 'No Loan Estimate. Clicked "No estimate yet?"'
        : 'No Loan Estimate attached.'
  ].join('\n');
  followUps.push(['note', () => ghl.addNote(contactId, note)]);

  for (const [step, fn] of followUps) {
    try {
      await fn();
    } catch (e) {
      log('lead_partial', { step, status: e instanceof GhlError ? e.status : 0 });
    }
  }

  log('lead_ok', { hasEstimate: Boolean(objectKey), waitlist: lead.waitlist });
  return json({ ok: true });
}

async function handleEstimate(req: Request, env: Env, objectKey: string): Promise<Response> {
  const url = new URL(req.url);
  const now = Math.floor(Date.now() / 1000);
  const deny = () => new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });
  if (!/^le\/[0-9a-f-]{36}\.(pdf|jpg|png|heic)$/.test(objectKey)) return deny();
  if (!(await verifyLink(objectKey, url.searchParams.get('exp'), url.searchParams.get('sig'), env.ESTIMATE_LINK_SECRET, now))) return deny();
  const obj = await env.ESTIMATES.get(objectKey);
  if (!obj) return deny();
  const retentionDays = Number(env.ESTIMATE_RETENTION_DAYS || 30);
  const uploaded = Date.parse(obj.customMetadata?.uploadedAt || '');
  if (!uploaded || Date.now() - uploaded > retentionDays * 86400_000) return deny();
  log('estimate_served');
  return new Response(obj.body, {
    headers: {
      'content-type': obj.httpMetadata?.contentType || 'application/octet-stream',
      'content-disposition': `attachment; filename="loan-estimate.${objectKey.split('.').pop()}"`,
      'cache-control': 'private, no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
      'x-robots-tag': 'noindex'
    }
  });
}

export async function handle(req: Request, env: Env, fetchImpl: typeof fetch = fetch): Promise<Response> {
  const url = new URL(req.url);
  try {
    if (url.pathname === '/api/lead') {
      if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405, { allow: 'POST' });
      return await handleLead(req, env, fetchImpl);
    }
    const m = url.pathname.match(/^\/api\/estimate\/(.+)$/);
    if (m) {
      if (req.method !== 'GET') return json({ ok: false, error: 'method' }, 405, { allow: 'GET' });
      return await handleEstimate(req, env, decodeURIComponent(m[1]));
    }
    if (url.pathname.startsWith('/api/')) return json({ ok: false, error: 'not_found' }, 404);
    return env.ASSETS ? env.ASSETS.fetch(req) : new Response('Not found', { status: 404 });
  } catch {
    log('unhandled_error', { path: url.pathname.startsWith('/api/estimate/') ? '/api/estimate' : url.pathname });
    return json({ ok: false, error: 'server' }, 500);
  }
}

export default {
  fetch: (req: Request, env: Env) => handle(req, env)
} satisfies ExportedHandler<Env>;
