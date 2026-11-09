import { vi } from 'vitest';
import type { Env } from '../src/env';

export const ORIGIN = 'https://lp.example.test';

export function makeBucket() {
  const store = new Map<string, { bytes: Uint8Array; contentType?: string; meta: Record<string, string> }>();
  const bucket = {
    store,
    put: vi.fn(async (key: string, bytes: Uint8Array, opts: any) => {
      store.set(key, { bytes, contentType: opts?.httpMetadata?.contentType, meta: opts?.customMetadata ?? {} });
    }),
    get: vi.fn(async (key: string) => {
      const o = store.get(key);
      return o ? { body: o.bytes, httpMetadata: { contentType: o.contentType }, customMetadata: o.meta } : null;
    }),
    delete: vi.fn(async (key: string) => void store.delete(key))
  };
  return bucket;
}

export function makeEnv(over: Partial<Env> = {}) {
  const bucket = makeBucket();
  const env = {
    GHL_TOKEN: 'test-token',
    GHL_LOCATION_ID: 'loc1',
    GHL_PIPELINE_ID: 'pipe1',
    GHL_STAGE_ID: 'stage1',
    ESTIMATE_LINK_SECRET: 'unit-test-secret',
    GHL_CF_LANGUAGE: 'cf_lang',
    GHL_CF_CONSENT_EMAIL: 'cf_ce',
    GHL_CF_CONSENT_CALLS: 'cf_cc',
    GHL_CF_ATTRIBUTION: 'cf_attr',
    ALLOWED_ORIGINS: ORIGIN,
    UPLOADS_ENABLED: 'true',
    ESTIMATES: bucket as unknown as R2Bucket,
    LEAD_LIMITER: { limit: vi.fn(async () => ({ success: true })) },
    ...over
  } as Env;
  return { env, bucket };
}

/** Fake GoHighLevel. Records every call; never touches the network. */
export function fakeGhl(fail: Partial<Record<'upsert' | 'tags' | 'opportunity' | 'note', number>> = {}) {
  const calls: Array<{ step: string; method: string; path: string; headers: Record<string, string>; body: any }> = [];
  const fetchImpl = vi.fn(async (url: string, init: RequestInit) => {
    const path = new URL(url).pathname;
    const step = path === '/contacts/upsert' ? 'upsert' : path.endsWith('/tags') ? 'tags' : path.startsWith('/opportunities') ? 'opportunity' : path.endsWith('/notes') ? 'note' : 'other';
    calls.push({ step, method: String(init.method), path, headers: init.headers as Record<string, string>, body: init.body ? JSON.parse(String(init.body)) : null });
    const status = fail[step as keyof typeof fail];
    if (status) return new Response('{"message":"boom internal detail"}', { status });
    if (step === 'upsert') return Response.json({ new: true, contact: { id: 'contact123' } });
    return Response.json({ ok: true });
  });
  return { fetchImpl: fetchImpl as unknown as typeof fetch, calls };
}

export const CONSENT_EMAIL_TEXT =
  'I agree to receive marketing emails about home financing from Everett Financial, Inc. D/B/A Supreme Lending (NMLS #2129). I can unsubscribe at any time. Consent is not required to obtain any product or service.';

export function payload(over: Record<string, unknown> = {}) {
  return {
    goal: 'buy',
    programs: ['murabaha', 'ijara'],
    firstName: 'Sam',
    lastName: 'Doe',
    phone: '+12145550123',
    email: 'sam@example.com',
    state: 'TX',
    language: 'Urdu',
    waitlist: false,
    hasEstimate: false,
    noEstimateClicked: false,
    consent: { email: { granted: true, text: CONSENT_EMAIL_TEXT }, callsTexts: { granted: false, text: 'x' } },
    pageUrl: ORIGIN + '/?utm_source=fb',
    utm: { utm_source: 'fb', utm_campaign: 'fall' },
    clientSubmittedAt: '2026-11-09T12:00:00Z',
    ...over
  };
}

export const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 10, 37, 37]);

export function leadRequest(p: unknown, opts: { file?: Blob; filename?: string; website?: string; extra?: [string, string]; origin?: string | null; ip?: string } = {}) {
  const form = new FormData();
  form.append('payload', typeof p === 'string' ? p : JSON.stringify(p));
  form.append('website', opts.website ?? '');
  if (opts.file) form.append('estimate', opts.file, opts.filename ?? 'le.pdf');
  if (opts.extra) form.append(...opts.extra);
  const headers: Record<string, string> = { 'cf-connecting-ip': opts.ip ?? '203.0.113.7', 'user-agent': 'TestAgent/1.0' };
  if (opts.origin !== null) headers.origin = opts.origin ?? ORIGIN;
  return new Request(ORIGIN + '/api/lead', { method: 'POST', body: form, headers });
}
