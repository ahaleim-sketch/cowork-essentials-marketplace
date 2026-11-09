// POST /api/lead          -> validate, store optional Loan Estimate in private R2, save lead + consent in D1, email the advisor
// GET  /api/estimate/:key -> serve a stored Loan Estimate to someone holding a valid, unexpired signed link
// Everything else          -> static site (Workers static assets)
import type { Env, SendEmail } from './env';
import { parseRequest, BadRequest } from './validate';
import { signLink, verifyLink } from './links';
import { saveLead, markAlertSent } from './store';
import { buildAlert } from './alert';

export interface Deps {
  sendEmail?: SendEmail;
}

const json = (body: unknown, status = 200, extra: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra }
  });

/** Structured log with no personal data: no names, phone, email, IP or amounts. */
function log(event: string, data: Record<string, string | number | boolean> = {}) {
  console.log(JSON.stringify({ event, ...data }));
}

function originAllowed(req: Request, env: Env) {
  const origin = req.headers.get('origin');
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return Boolean(origin && allowed.includes(origin));
}

async function handleLead(req: Request, env: Env, deps: Deps): Promise<Response> {
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
  const id = crypto.randomUUID();

  // 1. Store the Loan Estimate privately (R2 encrypts at rest). Random key, no PII in it.
  let objectKey: string | null = null;
  if (parsed.file) {
    objectKey = `le/${crypto.randomUUID()}.${parsed.file.kind === 'jpeg' ? 'jpg' : parsed.file.kind}`;
    await env.ESTIMATES.put(objectKey, parsed.file.bytes, {
      httpMetadata: { contentType: parsed.file.contentType },
      customMetadata: { uploadedAt: at }
    });
  }

  // 2. Save the lead and both consent records. This is the record of truth.
  try {
    await saveLead(env.DB, id, lead, objectKey, { at, ip, ua: (req.headers.get('user-agent') || '').slice(0, 300) });
  } catch {
    if (objectKey) await env.ESTIMATES.delete(objectKey).catch(() => {});
    log('lead_failed', { step: 'db' });
    return json({ ok: false, error: 'server' }, 502);
  }

  // 3. Email the advisor. The lead is already saved, so a failure here is logged
  //    (alert_sent stays 0 and `npm run leads -- unsent` lists it), not returned.
  const ttlHours = Number(env.ESTIMATE_LINK_TTL_HOURS || 72);
  const estimate = objectKey
    ? {
        link: await signLink(new URL(req.url).origin, objectKey, Math.floor(Date.now() / 1000) + ttlHours * 3600, env.ESTIMATE_LINK_SECRET),
        ttlHours
      }
    : null;
  try {
    if (!deps.sendEmail) throw new Error('no email binding');
    const { subject, text } = buildAlert(id, lead, at, estimate);
    await deps.sendEmail({ from: env.ALERT_FROM, to: env.ALERT_TO, subject, text });
    await markAlertSent(env.DB, id);
  } catch {
    log('alert_failed', { lead: id });
  }

  log('lead_ok', { lead: id, hasEstimate: Boolean(objectKey), waitlist: lead.waitlist });
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

export async function handle(req: Request, env: Env, deps: Deps = {}): Promise<Response> {
  const url = new URL(req.url);
  try {
    if (url.pathname === '/api/lead') {
      if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405, { allow: 'POST' });
      return await handleLead(req, env, deps);
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
