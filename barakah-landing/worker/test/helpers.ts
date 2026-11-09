import { vi } from 'vitest';
import type { Env } from '../src/env';
import { makeD1 } from './d1';

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

export function makeEnv(over: Partial<Env> = {}, dbOpts: { failBatch?: boolean } = {}) {
  const bucket = makeBucket();
  const db = makeD1(dbOpts);
  const env = {
    ESTIMATE_LINK_SECRET: 'unit-test-secret',
    ALLOWED_ORIGINS: ORIGIN,
    ALERT_FROM: 'leads@lp.example.test',
    ALERT_TO: 'advisor@lp.example.test',
    UPLOADS_ENABLED: 'true',
    DB: db as unknown as D1Database,
    ESTIMATES: bucket as unknown as R2Bucket,
    LEAD_LIMITER: { limit: vi.fn(async () => ({ success: true })) },
    ...over
  } as Env;
  return { env, bucket, db };
}

/** Fake email sender. Records messages; can be told to fail. */
export function fakeMail(fail = false) {
  const sent: Array<{ from: string; to: string; subject: string; text: string }> = [];
  const sendEmail = vi.fn(async (m: (typeof sent)[number]) => {
    if (fail) throw new Error('email routing error');
    sent.push(m);
  });
  return { sent, sendEmail };
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
