import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { handle } from '../src/index';
import { CONSENT_TEXT } from '../src/consent';
import { sniff } from '../src/validate';
import { makeEnv, fakeGhl, payload, leadRequest, PDF, ORIGIN, CONSENT_EMAIL_TEXT } from './helpers';

let logs: string[] = [];
beforeEach(() => {
  logs = [];
  vi.spyOn(console, 'log').mockImplementation((m: string) => void logs.push(String(m)));
  // Any accidental real network call fails the test.
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

describe('POST /api/lead: happy path, no file', () => {
  it('upserts the contact, adds tags, creates an opportunity and a note', async () => {
    const { env } = makeEnv();
    const g = fakeGhl();
    const res = await handle(leadRequest(payload()), env, g.fetchImpl);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(g.calls.map((c) => c.step)).toEqual(['upsert', 'tags', 'opportunity', 'note']);

    const up = g.calls[0];
    expect(up.headers.Authorization).toBe('Bearer test-token');
    expect(up.headers.Version).toBe('2021-07-28');
    expect(up.body).toMatchObject({
      locationId: 'loc1', firstName: 'Sam', lastName: 'Doe', phone: '+12145550123', email: 'sam@example.com', state: 'TX', source: 'Barakah landing page'
    });
    expect(up.body.tags).toBeUndefined(); // tags are added separately so existing ones survive

    expect(g.calls[1].body.tags).toEqual([
      'barakah-lp', 'goal:buy', 'program:murabaha', 'program:ijara', 'has-estimate:no', 'needs-qualification-review', 'consent:email'
    ]);
    expect(g.calls[2].body).toMatchObject({ pipelineId: 'pipe1', pipelineStageId: 'stage1', contactId: 'contact123', status: 'open', locationId: 'loc1' });
    expect(g.calls[3].path).toBe('/contacts/contact123/notes');
    expect(g.calls[3].body.body).toContain('No Loan Estimate attached.');
    noPiiInLogs();
  });

  it('records each consent separately with timestamp, page URL, IP, UA and the exact text', async () => {
    const { env } = makeEnv();
    const g = fakeGhl();
    await handle(leadRequest(payload()), env, g.fetchImpl);
    const cf = Object.fromEntries(g.calls[0].body.customFields.map((f: any) => [f.id, f.field_value]));
    expect(cf.cf_lang).toBe('Urdu');
    const email = JSON.parse(cf.cf_ce);
    expect(email).toMatchObject({ granted: true, ip: '203.0.113.7', userAgent: 'TestAgent/1.0', pageUrl: ORIGIN + '/', textShown: CONSENT_EMAIL_TEXT, textMatchesServer: true });
    expect(Date.parse(email.timestamp)).not.toBeNaN();
    const calls = JSON.parse(cf.cf_cc);
    expect(calls).toMatchObject({ granted: false, textMatchesServer: false });
    expect(JSON.parse(cf.cf_attr)).toEqual({ pageUrl: ORIGIN + '/', utm_source: 'fb', utm_campaign: 'fall' });
  });

  it('only lifts DND for the channels actually consented to', async () => {
    const { env } = makeEnv();
    let g = fakeGhl();
    await handle(leadRequest(payload()), env, g.fetchImpl);
    expect(Object.keys(g.calls[0].body.dndSettings)).toEqual(['email']);

    g = fakeGhl();
    await handle(leadRequest(payload({ consent: { email: { granted: false, text: '' }, callsTexts: { granted: true, text: CONSENT_TEXT.callsTexts } } })), env, g.fetchImpl);
    expect(Object.keys(g.calls[0].body.dndSettings).sort()).toEqual(['call', 'sms']);
    expect(g.calls[1].body.tags).toContain('consent:calls-texts');
    expect(g.calls[1].body.tags).not.toContain('consent:email');

    g = fakeGhl();
    await handle(leadRequest(payload({ consent: { email: { granted: false, text: '' }, callsTexts: { granted: false, text: '' } } })), env, g.fetchImpl);
    expect(g.calls[0].body.dndSettings).toBeUndefined();
  });
});

describe('validation and abuse controls', () => {
  it('rejects unknown payload fields and unknown form parts', async () => {
    const { env } = makeEnv();
    const g = fakeGhl();
    expect((await handle(leadRequest(payload({ ssn: '123' })), env, g.fetchImpl)).status).toBe(400);
    expect((await handle(leadRequest(payload(), { extra: ['admin', '1'] }), env, g.fetchImpl)).status).toBe(400);
    expect((await handle(leadRequest(payload({ consent: { email: { granted: true, text: '', extra: 1 } } })), env, g.fetchImpl)).status).toBe(400);
    expect((await handle(leadRequest(payload({ utm: { gclid: 'x' } })), env, g.fetchImpl)).status).toBe(400);
    expect(g.calls).toHaveLength(0);
  });

  it('re-validates name, phone, email, state, goal, program and language', async () => {
    const { env } = makeEnv();
    const g = fakeGhl();
    for (const bad of [
      { firstName: '', lastName: '' },
      { phone: '555', email: '' },
      { phone: '', email: '' },
      { email: 'nope' },
      { state: 'NY' },
      { goal: 'sell' },
      { programs: ['payday'] },
      { language: 'Klingon' }
    ]) {
      const res = await handle(leadRequest(payload(bad)), env, g.fetchImpl);
      expect(res.status, JSON.stringify(bad)).toBe(400);
    }
    expect((await handle(leadRequest('not json'), env, g.fetchImpl)).status).toBe(400);
    expect(g.calls).toHaveLength(0);
  });

  it('normalizes a loosely formatted phone to E.164', async () => {
    const { env } = makeEnv();
    const g = fakeGhl();
    await handle(leadRequest(payload({ phone: '(512) 555-0199' })), env, g.fetchImpl);
    expect(g.calls[0].body.phone).toBe('+15125550199');
  });

  it('blocks other origins and missing origin', async () => {
    const { env } = makeEnv();
    const g = fakeGhl();
    expect((await handle(leadRequest(payload(), { origin: 'https://evil.example' }), env, g.fetchImpl)).status).toBe(403);
    expect((await handle(leadRequest(payload(), { origin: null }), env, g.fetchImpl)).status).toBe(403);
  });

  it('rate limits per IP', async () => {
    const limit = vi.fn(async ({ key }: { key: string }) => ({ success: key !== '198.51.100.9' }));
    const { env } = makeEnv({ LEAD_LIMITER: { limit } });
    const g = fakeGhl();
    const res = await handle(leadRequest(payload(), { ip: '198.51.100.9' }), env, g.fetchImpl);
    expect(res.status).toBe(429);
    expect(limit).toHaveBeenCalledWith({ key: '198.51.100.9' });
    expect(g.calls).toHaveLength(0);
  });

  it('honeypot: reports success but writes nothing', async () => {
    const { env, bucket } = makeEnv();
    const g = fakeGhl();
    const res = await handle(leadRequest(payload(), { website: 'http://spam', file: new Blob([PDF]) }), env, g.fetchImpl);
    expect(await res.json()).toEqual({ ok: true });
    expect(g.calls).toHaveLength(0);
    expect(bucket.put).not.toHaveBeenCalled();
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
    const g = fakeGhl();
    const res = await handle(leadRequest(payload(), { file: new Blob([PDF]) }), env, g.fetchImpl);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: 'upload_not_accepted' });
    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('stores it privately under a random key and puts only a signed link in the note', async () => {
    const { env, bucket } = makeEnv();
    const g = fakeGhl();
    const res = await handle(leadRequest(payload(), { file: new Blob([PDF]), filename: 'Sam Doe LE.pdf' }), env, g.fetchImpl);
    expect(res.status).toBe(200);
    const [key] = [...bucket.store.keys()];
    expect(key).toMatch(/^le\/[0-9a-f-]{36}\.pdf$/);
    expect(key).not.toContain('Sam');
    expect(bucket.store.get(key)!.contentType).toBe('application/pdf');

    expect(g.calls[1].body.tags).toContain('has-estimate:yes');
    expect(g.calls[1].body.tags).not.toContain('needs-qualification-review');
    const note: string = g.calls[3].body.body;
    const link = note.match(/https:\/\/\S+/)![0];
    expect(link).toContain('/api/estimate/');
    // No file bytes went to GHL.
    expect(JSON.stringify(g.calls)).not.toContain('%PDF');

    // The signed link works...
    const ok = await handle(new Request(link), env);
    expect(ok.status).toBe(200);
    expect(ok.headers.get('content-disposition')).toContain('attachment');
    expect(ok.headers.get('cache-control')).toContain('no-store');
    // ...a tampered one does not...
    expect((await handle(new Request(link.replace(/sig=./, 'sig=A')), env)).status).toBe(404);
    expect((await handle(new Request(link.replace(/exp=\d+/, 'exp=9999999999')), env)).status).toBe(404);
    // ...an unsigned one does not...
    expect((await handle(new Request(ORIGIN + '/api/estimate/' + key), env)).status).toBe(404);
    // ...and it stops working after it expires.
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 73 * 3600 * 1000);
    expect((await handle(new Request(link), env)).status).toBe(404);
    vi.useRealTimers();
  });

  it('refuses a file older than the retention period even with a fresh link', async () => {
    const { env, bucket } = makeEnv({ ESTIMATE_RETENTION_DAYS: '30', ESTIMATE_LINK_TTL_HOURS: '100000' });
    const g = fakeGhl();
    await handle(leadRequest(payload(), { file: new Blob([PDF]) }), env, g.fetchImpl);
    const [key] = [...bucket.store.keys()];
    bucket.store.get(key)!.meta.uploadedAt = new Date(Date.now() - 31 * 86400_000).toISOString();
    const link = (g.calls[3].body.body as string).match(/https:\/\/\S+/)![0];
    expect((await handle(new Request(link), env)).status).toBe(404);
  });

  it('checks the real file type, not the name', async () => {
    const { env, bucket } = makeEnv();
    const g = fakeGhl();
    const html = new Blob(['<html><script>alert(1)</script>']);
    const res = await handle(leadRequest(payload(), { file: html, filename: 'le.pdf' }), env, g.fetchImpl);
    expect(res.status).toBe(415);
    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('enforces 10 MB', async () => {
    const { env } = makeEnv();
    const g = fakeGhl();
    const big = new Uint8Array(10 * 1024 * 1024 + 1);
    big.set(PDF);
    const res = await handle(leadRequest(payload(), { file: new Blob([big]) }), env, g.fetchImpl);
    expect(res.status).toBe(413);
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
  it('counts as has-estimate and says so in the note', async () => {
    const { env } = makeEnv({ UPLOADS_ENABLED: 'false' });
    const g = fakeGhl();
    const res = await handle(leadRequest(payload({ estimateAttachedNotSent: true })), env, g.fetchImpl);
    expect(res.status).toBe(200);
    expect(g.calls[1].body.tags).toContain('has-estimate:yes');
    expect(g.calls[1].body.tags).not.toContain('needs-qualification-review');
    expect(g.calls[3].body.body).toContain('not uploaded while uploads are off');
  });
});

describe('"Other state" waitlist', () => {
  it('tags the contact, skips the opportunity, and refuses a file', async () => {
    const { env } = makeEnv();
    let g = fakeGhl();
    await handle(leadRequest(payload({ state: 'OTHER', waitlist: true })), env, g.fetchImpl);
    expect(g.calls.map((c) => c.step)).toEqual(['upsert', 'tags', 'note']);
    expect(g.calls[0].body.state).toBeUndefined();
    expect(g.calls[1].body.tags).toContain('state:other-waitlist');

    g = fakeGhl();
    const res = await handle(leadRequest(payload({ state: 'OTHER' }), { file: new Blob([PDF]) }), env, g.fetchImpl);
    expect(res.status).toBe(400);
  });
});

describe('GHL failures', () => {
  it('upsert failure: safe 502, uploaded file deleted, no internals leaked', async () => {
    const { env, bucket } = makeEnv();
    const g = fakeGhl({ upsert: 401 });
    const res = await handle(leadRequest(payload(), { file: new Blob([PDF]) }), env, g.fetchImpl);
    expect(res.status).toBe(502);
    const text = await res.text();
    expect(JSON.parse(text)).toEqual({ ok: false, error: 'server' });
    expect(text).not.toContain('boom');
    expect(bucket.store.size).toBe(0);
    expect(logs.join()).toContain('"step":"upsert","status":401');
    noPiiInLogs();
  });

  it('opportunity failure after the contact exists: still ok, logged as partial', async () => {
    const { env } = makeEnv();
    const g = fakeGhl({ opportunity: 500 });
    const res = await handle(leadRequest(payload()), env, g.fetchImpl);
    expect(res.status).toBe(200);
    expect(g.calls.map((c) => c.step)).toEqual(['upsert', 'tags', 'opportunity', 'note']);
    expect(logs.join()).toContain('lead_partial');
  });
});

describe('page and server stay in sync', () => {
  it('consent text in index.html matches the server copy exactly', () => {
    const html = readFileSync(new URL('../../public/index.html', import.meta.url), 'utf8');
    const text = (id: string) => html.match(new RegExp(`<span id="${id}">([^<]*)</span>`))![1].replace(/&amp;/g, '&');
    expect(text('c1-text')).toBe(CONSENT_TEXT.email);
    expect(text('c2-text')).toBe(CONSENT_TEXT.callsTexts);
  });

  it('unknown /api paths 404 without touching assets', async () => {
    const { env } = makeEnv();
    expect((await handle(new Request(ORIGIN + '/api/other'), env)).status).toBe(404);
  });
});
