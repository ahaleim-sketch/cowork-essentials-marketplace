import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { handle } from '../src/index';
import { CONSENT_TEXT, CONSENT_VERSION } from '../src/consent';
import { sniff } from '../src/validate';
import { toMime } from '../src/alert';
import { signLink } from '../src/links';
// @ts-expect-error -- plain JS CLI
import { sign as cliSign } from '../scripts/leads.mjs';
import { makeEnv, fakeMail, payload, leadRequest, PDF, ORIGIN, CONSENT_EMAIL_TEXT } from './helpers';

let logs: string[] = [];
beforeEach(() => {
  logs = [];
  vi.spyOn(console, 'log').mockImplementation((m: string) => void logs.push(String(m)));
  // Nothing may go to the network: no CRM, no third party.
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('real network used'); }));
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const noPiiInLogs = () => {
  const all = logs.join('\n');
  for (const s of ['Sam', 'Doe', '2145550123', 'sam@example.com', '203.0.113.7', 'TestAgent']) expect(all).not.toContain(s);
};
const rows = (db: any, sql: string) => db.sqlite.prepare(sql).all() as any[];

describe('POST /api/lead: saved to D1 and emailed', () => {
  it('saves the lead, both consent records, and sends one alert', async () => {
    const { env, db } = makeEnv();
    const mail = fakeMail();
    const res = await handle(leadRequest(payload()), env, { sendEmail: mail.sendEmail });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const [lead] = rows(db, 'SELECT * FROM leads');
    expect(lead).toMatchObject({
      status: 'new', goal: 'buy', first_name: 'Sam', last_name: 'Doe', phone: '+12145550123', email: 'sam@example.com',
      state: 'TX', language: 'Urdu', waitlist: 0, has_estimate: 0, estimate_key: null, page_url: ORIGIN + '/', alert_sent: 1
    });
    expect(JSON.parse(lead.programs)).toEqual(['murabaha', 'ijara']);
    expect(JSON.parse(lead.utm)).toEqual({ utm_source: 'fb', utm_campaign: 'fall' });

    const consents = rows(db, 'SELECT * FROM consents ORDER BY channel');
    expect(consents).toHaveLength(2);
    expect(consents[1]).toMatchObject({
      lead_id: lead.id, channel: 'email', granted: 1, ip: '203.0.113.7', user_agent: 'TestAgent/1.0', page_url: ORIGIN + '/',
      consent_version: CONSENT_VERSION, text_shown: CONSENT_EMAIL_TEXT, text_matches_server: 1
    });
    expect(consents[0]).toMatchObject({ channel: 'calls_texts', granted: 0, text_matches_server: 0 });
    expect(Date.parse(consents[1].recorded_at)).not.toBeNaN();

    expect(mail.sent).toHaveLength(1);
    const m = mail.sent[0];
    expect(m).toMatchObject({ from: 'leads@lp.example.test', to: 'advisor@lp.example.test', subject: 'New Barakah lead: Buy a home (TX)' });
    expect(m.subject).not.toContain('Sam');
    expect(m.text).toContain('Name:      Sam Doe');
    expect(m.text).toContain('Phone:     +12145550123');
    expect(m.text).toContain('Programs:  Cost plus Profit (Murabaha), Home Earned Equity (Ijara)');
    expect(m.text).toContain('Calls/texts (autodialer) consent: NO');
    expect(m.text).toContain('Do not add this person to automated calls or texts.');
    expect(m.text).toContain(`Lead ID:   ${lead.id}`);
    noPiiInLogs();
  });

  it('email failure: lead still saved, alert_sent = 0, still ok', async () => {
    const { env, db } = makeEnv();
    const res = await handle(leadRequest(payload()), env, { sendEmail: fakeMail(true).sendEmail });
    expect(res.status).toBe(200);
    expect(rows(db, 'SELECT alert_sent FROM leads')).toEqual([{ alert_sent: 0 }]);
    expect(logs.join()).toContain('alert_failed');
    noPiiInLogs();
  });

  it('database failure: safe 502, uploaded file deleted, no email', async () => {
    const { env, bucket } = makeEnv({}, { failBatch: true });
    const mail = fakeMail();
    const res = await handle(leadRequest(payload(), { file: new Blob([PDF]) }), env, { sendEmail: mail.sendEmail });
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: 'server' });
    expect(bucket.store.size).toBe(0);
    expect(mail.sent).toHaveLength(0);
  });

  it('a lead and its consents are written together or not at all', async () => {
    const { env, db } = makeEnv();
    // Simulate the consent insert failing mid-batch: the lead row must roll back too.
    const p = db.prepare.bind(db);
    db.prepare = (sql: string) => (sql.includes('INSERT INTO consents') ? p('INSERT INTO consents (id) VALUES (NULL, ?)') : p(sql));
    const res = await handle(leadRequest(payload()), env, { sendEmail: fakeMail().sendEmail });
    expect(res.status).toBe(502);
    expect(rows(db, 'SELECT COUNT(*) AS n FROM leads')).toEqual([{ n: 0 }]);
  });
});

describe('validation and abuse controls', () => {
  const fresh = () => ({ ...makeEnv(), mail: fakeMail() });

  it('rejects unknown payload fields and unknown form parts', async () => {
    const { env, db, mail } = fresh();
    const deps = { sendEmail: mail.sendEmail };
    expect((await handle(leadRequest(payload({ ssn: '123' })), env, deps)).status).toBe(400);
    expect((await handle(leadRequest(payload(), { extra: ['admin', '1'] }), env, deps)).status).toBe(400);
    expect((await handle(leadRequest(payload({ consent: { email: { granted: true, text: '', extra: 1 } } })), env, deps)).status).toBe(400);
    expect((await handle(leadRequest(payload({ utm: { gclid: 'x' } })), env, deps)).status).toBe(400);
    expect(rows(db, 'SELECT COUNT(*) AS n FROM leads')).toEqual([{ n: 0 }]);
    expect(mail.sent).toHaveLength(0);
  });

  it('re-validates name, phone, email, state, goal, program and language', async () => {
    const { env, db, mail } = fresh();
    for (const bad of [
      { firstName: '', lastName: '' }, { phone: '555', email: '' }, { phone: '', email: '' }, { email: 'nope' },
      { state: 'NY' }, { goal: 'sell' }, { programs: ['payday'] }, { language: 'Klingon' }
    ]) {
      expect((await handle(leadRequest(payload(bad)), env, { sendEmail: mail.sendEmail })).status, JSON.stringify(bad)).toBe(400);
    }
    expect((await handle(leadRequest('not json'), env)).status).toBe(400);
    expect(rows(db, 'SELECT COUNT(*) AS n FROM leads')).toEqual([{ n: 0 }]);
  });

  it('normalizes a loosely formatted phone to E.164', async () => {
    const { env, db, mail } = fresh();
    await handle(leadRequest(payload({ phone: '(512) 555-0199' })), env, { sendEmail: mail.sendEmail });
    expect(rows(db, 'SELECT phone FROM leads')).toEqual([{ phone: '+15125550199' }]);
  });

  it('stores SQL-looking input as plain text', async () => {
    const { env, db, mail } = fresh();
    await handle(leadRequest(payload({ lastName: "O'Brien'); DROP TABLE leads;--" })), env, { sendEmail: mail.sendEmail });
    expect(rows(db, 'SELECT last_name FROM leads')).toEqual([{ last_name: "O'Brien'); DROP TABLE leads;--" }]);
  });

  it('blocks other origins and missing origin', async () => {
    const { env } = makeEnv();
    expect((await handle(leadRequest(payload(), { origin: 'https://evil.example' }), env)).status).toBe(403);
    expect((await handle(leadRequest(payload(), { origin: null }), env)).status).toBe(403);
  });

  it('rate limits per IP', async () => {
    const limit = vi.fn(async ({ key }: { key: string }) => ({ success: key !== '198.51.100.9' }));
    const { env, db } = makeEnv({ LEAD_LIMITER: { limit } });
    const res = await handle(leadRequest(payload(), { ip: '198.51.100.9' }), env);
    expect(res.status).toBe(429);
    expect(limit).toHaveBeenCalledWith({ key: '198.51.100.9' });
    expect(rows(db, 'SELECT COUNT(*) AS n FROM leads')).toEqual([{ n: 0 }]);
  });

  it('honeypot: reports success but stores and sends nothing', async () => {
    const { env, db, bucket, mail } = fresh();
    const res = await handle(leadRequest(payload(), { website: 'http://spam', file: new Blob([PDF]) }), env, { sendEmail: mail.sendEmail });
    expect(await res.json()).toEqual({ ok: true });
    expect(rows(db, 'SELECT COUNT(*) AS n FROM leads')).toEqual([{ n: 0 }]);
    expect(bucket.put).not.toHaveBeenCalled();
    expect(mail.sent).toHaveLength(0);
  });

  it('rejects non-POST and non-multipart', async () => {
    const { env } = makeEnv();
    expect((await handle(new Request(ORIGIN + '/api/lead'), env)).status).toBe(405);
    const r = new Request(ORIGIN + '/api/lead', { method: 'POST', body: '{}', headers: { origin: ORIGIN, 'content-type': 'application/json' } });
    expect((await handle(r, env)).status).toBe(415);
  });
});

describe('Loan Estimate upload', () => {
  it('is refused while UPLOADS_ENABLED is not "true"', async () => {
    const { env, bucket } = makeEnv({ UPLOADS_ENABLED: 'false' });
    const res = await handle(leadRequest(payload(), { file: new Blob([PDF]) }), env);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: 'upload_not_accepted' });
    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('is stored privately under a random key; the email carries only a signed link', async () => {
    const { env, bucket, db } = makeEnv();
    const mail = fakeMail();
    const res = await handle(leadRequest(payload(), { file: new Blob([PDF]), filename: 'Sam Doe LE.pdf' }), env, { sendEmail: mail.sendEmail });
    expect(res.status).toBe(200);
    const [key] = [...bucket.store.keys()];
    expect(key).toMatch(/^le\/[0-9a-f-]{36}\.pdf$/);
    expect(key).not.toContain('Sam');
    expect(bucket.store.get(key)!.contentType).toBe('application/pdf');
    expect(rows(db, 'SELECT has_estimate, estimate_key FROM leads')).toEqual([{ has_estimate: 1, estimate_key: key }]);

    const link = mail.sent[0].text.match(/https:\/\/\S+/)![0];
    expect(link).toContain('/api/estimate/');
    expect(mail.sent[0].text).not.toContain('%PDF');

    const ok = await handle(new Request(link), env);
    expect(ok.status).toBe(200);
    expect(ok.headers.get('content-disposition')).toContain('attachment');
    expect(ok.headers.get('cache-control')).toContain('no-store');
    expect((await handle(new Request(link.replace(/sig=./, 'sig=A')), env)).status).toBe(404);
    expect((await handle(new Request(link.replace(/exp=\d+/, 'exp=9999999999')), env)).status).toBe(404);
    expect((await handle(new Request(ORIGIN + '/api/estimate/' + key), env)).status).toBe(404);
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 73 * 3600 * 1000);
    expect((await handle(new Request(link), env)).status).toBe(404);
    vi.useRealTimers();
  });

  it('refuses a file older than the retention period even with a fresh link', async () => {
    const { env, bucket } = makeEnv({ ESTIMATE_RETENTION_DAYS: '30', ESTIMATE_LINK_TTL_HOURS: '100000' });
    const mail = fakeMail();
    await handle(leadRequest(payload(), { file: new Blob([PDF]) }), env, { sendEmail: mail.sendEmail });
    const [key] = [...bucket.store.keys()];
    bucket.store.get(key)!.meta.uploadedAt = new Date(Date.now() - 31 * 86400_000).toISOString();
    const link = mail.sent[0].text.match(/https:\/\/\S+/)![0];
    expect((await handle(new Request(link), env)).status).toBe(404);
  });

  it('the CLI re-sign produces links the Worker accepts', async () => {
    const key = 'le/123e4567-e89b-12d3-a456-426614174000.pdf';
    const exp = 2000000000;
    const fromWorker = await signLink(ORIGIN, key, exp, 's3cret');
    expect(fromWorker.endsWith(`sig=${cliSign(key, exp, 's3cret')}`)).toBe(true);
  });

  it('checks the real file type, not the name', async () => {
    const { env, bucket } = makeEnv();
    const res = await handle(leadRequest(payload(), { file: new Blob(['<html><script>alert(1)</script>']), filename: 'le.pdf' }), env);
    expect(res.status).toBe(415);
    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('enforces 10 MB', async () => {
    const { env } = makeEnv();
    const big = new Uint8Array(10 * 1024 * 1024 + 1);
    big.set(PDF);
    expect((await handle(leadRequest(payload(), { file: new Blob([big]) }), env)).status).toBe(413);
  });

  it('sniff recognizes PDF, JPEG, PNG and HEIC', () => {
    expect(sniff(PDF)).toBe('pdf');
    expect(sniff(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe('jpeg');
    expect(sniff(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe('png');
    expect(sniff(new Uint8Array([0, 0, 0, 24, ...new TextEncoder().encode('ftypheic')]))).toBe('heic');
    expect(sniff(new TextEncoder().encode('GIF89a......'))).toBeNull();
  });
});

describe('estimate kept on the page (uploads off)', () => {
  it('counts as has_estimate and the email says so', async () => {
    const { env, db } = makeEnv({ UPLOADS_ENABLED: 'false' });
    const mail = fakeMail();
    await handle(leadRequest(payload({ estimateAttachedNotSent: true })), env, { sendEmail: mail.sendEmail });
    expect(rows(db, 'SELECT has_estimate, estimate_attached_not_sent, estimate_key FROM leads')).toEqual([
      { has_estimate: 1, estimate_attached_not_sent: 1, estimate_key: null }
    ]);
    expect(mail.sent[0].text).toContain('not uploaded while uploads are off');
  });
});

describe('"Other state" waitlist', () => {
  it('is saved as waitlist with its own subject, and refuses a file', async () => {
    const { env, db } = makeEnv();
    const mail = fakeMail();
    await handle(leadRequest(payload({ state: 'OTHER', waitlist: true })), env, { sendEmail: mail.sendEmail });
    expect(rows(db, 'SELECT state, waitlist FROM leads')).toEqual([{ state: 'OTHER', waitlist: 1 }]);
    expect(mail.sent[0].subject).toBe('Barakah waitlist request (other state)');
    expect((await handle(leadRequest(payload({ state: 'OTHER' }), { file: new Blob([PDF]) }), env)).status).toBe(400);
  });
});

describe('email format', () => {
  it('puts no user data in headers and encodes non-ASCII safely', () => {
    const raw = toMime('leads@x.test', 'a@x.test', 'New Barakah lead: Buy a home (TX)', 'Name: Zoë Ali\nLine 2', new Date('2026-11-09T12:00:00Z'));
    const [head, body] = raw.split('\r\n\r\n');
    expect(head).toContain('Subject: =?UTF-8?B?');
    expect(head).toMatch(/Message-ID: <[0-9a-f-]{36}@x\.test>/);
    expect(head).not.toContain('Zoë');
    expect(new TextDecoder().decode(Uint8Array.from(atob(body.replace(/\r\n/g, '')), (c) => c.charCodeAt(0)))).toBe('Name: Zoë Ali\r\nLine 2');
  });
});

describe('page and server stay in sync', () => {
  it('consent text in index.html matches the server copy exactly', () => {
    const html = readFileSync(new URL('../../public/index.html', import.meta.url), 'utf8');
    const text = (id: string) => html.match(new RegExp(`<span id="${id}">([^<]*)</span>`))![1].replace(/&amp;/g, '&');
    expect(text('c1-text')).toBe(CONSENT_TEXT.email);
    expect(text('c2-text')).toBe(CONSENT_TEXT.callsTexts);
  });

  it('unknown /api paths 404', async () => {
    const { env } = makeEnv();
    expect((await handle(new Request(ORIGIN + '/api/other'), env)).status).toBe(404);
  });
});
