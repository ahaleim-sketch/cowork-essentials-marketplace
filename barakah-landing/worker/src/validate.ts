// Server-side validation. The client is untrusted: everything is checked again here.
// Shared plain-JS module, also used by the browser, so client and server rules cannot drift.
import * as shared from '../../public/form-validation.js';
const { validateLead, PROGRAMS, LANGUAGES } = shared as unknown as {
  validateLead: (v: Record<string, unknown>, states: string[]) => { ok: boolean; errors: Record<string, string>; clean: any };
  PROGRAMS: string[];
  LANGUAGES: string[];
};
import { CONSENT_TEXT } from './consent';

export const LICENSED_STATES = ['CA', 'FL', 'MN', 'OR', 'TX', 'VA', 'WA'];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_BODY_BYTES = MAX_FILE_BYTES + 256 * 1024;

const ALLOWED_PARTS = new Set(['payload', 'website', 'estimate']);
const ALLOWED_KEYS = new Set([
  'goal', 'programs', 'firstName', 'lastName', 'phone', 'email', 'state', 'language', 'waitlist',
  'hasEstimate', 'estimateAttachedNotSent', 'noEstimateClicked', 'consent', 'pageUrl', 'utm', 'clientSubmittedAt'
]);
const UTM_KEYS = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']);

export type FileKind = 'pdf' | 'jpeg' | 'png' | 'heic';

export interface ConsentRecord {
  granted: boolean;
  textShown: string;
  textMatchesServer: boolean;
}

export interface Lead {
  goal: 'buy' | 'refi';
  programs: string[];
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
  state: string;
  language: string;
  waitlist: boolean;
  noEstimateClicked: boolean;
  estimateAttachedNotSent: boolean;
  consent: { email: ConsentRecord; callsTexts: ConsentRecord };
  pageUrl: string;
  utm: Record<string, string>;
}

export interface Parsed {
  spam: boolean;
  lead?: Lead;
  file?: { bytes: Uint8Array; kind: FileKind; contentType: string };
}

export class BadRequest extends Error {
  constructor(public code: string, public status = 400) {
    super(code);
  }
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');

/** Identify the file by its first bytes, not by the name or MIME type the browser sent. */
export function sniff(b: Uint8Array): FileKind | null {
  if (b.length >= 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2d) return 'pdf';
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (b.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((x, i) => b[i] === x)) return 'png';
  if (b.length >= 12) {
    const box = String.fromCharCode(...b.slice(4, 8));
    const brand = String.fromCharCode(...b.slice(8, 12));
    if (box === 'ftyp' && ['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1', 'heif'].includes(brand)) return 'heic';
  }
  return null;
}

const CONTENT_TYPES: Record<FileKind, string> = {
  pdf: 'application/pdf', jpeg: 'image/jpeg', png: 'image/png', heic: 'image/heic'
};

function consentRecord(v: unknown, canonical: string): ConsentRecord {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  if (Object.keys(o).some((k) => k !== 'granted' && k !== 'text')) throw new BadRequest('invalid');
  const textShown = str(o.text, 2000).trim();
  return { granted: o.granted === true, textShown, textMatchesServer: textShown === canonical };
}

function cleanPageUrl(v: unknown): string {
  try {
    const u = new URL(str(v, 500));
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return '';
    return u.origin + u.pathname; // never keep a query string or fragment
  } catch {
    return '';
  }
}

export async function parseRequest(req: Request, uploadsEnabled: boolean): Promise<Parsed> {
  const len = Number(req.headers.get('content-length') || '0');
  if (len > MAX_BODY_BYTES) throw new BadRequest('too_large', 413);
  if (!(req.headers.get('content-type') || '').toLowerCase().startsWith('multipart/form-data')) {
    throw new BadRequest('invalid', 415);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    throw new BadRequest('invalid');
  }
  for (const key of form.keys()) if (!ALLOWED_PARTS.has(key)) throw new BadRequest('invalid');

  // Honeypot: report success, do nothing.
  if (str(form.get('website'), 500).trim() !== '') return { spam: true };

  let p: Record<string, unknown>;
  try {
    p = JSON.parse(str(form.get('payload'), 20000));
  } catch {
    throw new BadRequest('invalid');
  }
  if (!p || typeof p !== 'object' || Array.isArray(p)) throw new BadRequest('invalid');
  for (const k of Object.keys(p)) if (!ALLOWED_KEYS.has(k)) throw new BadRequest('invalid');

  const programs = Array.isArray(p.programs) ? p.programs.map((x) => str(x, 40)) : [];
  if (programs.some((x) => !PROGRAMS.includes(x))) throw new BadRequest('invalid');
  if (p.language !== undefined && !LANGUAGES.includes(p.language as string)) throw new BadRequest('invalid');

  const name = `${str(p.firstName, 60)} ${str(p.lastName, 80)}`.trim();
  const v = validateLead(
    { goal: p.goal, programs, name, phone: str(p.phone, 25), email: str(p.email, 254), state: str(p.state, 5), language: p.language },
    LICENSED_STATES
  );
  if (!v.ok) throw new BadRequest('invalid');

  const consent = (p.consent && typeof p.consent === 'object' ? p.consent : {}) as Record<string, unknown>;
  if (Object.keys(consent).some((k) => k !== 'email' && k !== 'callsTexts')) throw new BadRequest('invalid');

  const utm: Record<string, string> = {};
  if (p.utm && typeof p.utm === 'object') {
    for (const [k, val] of Object.entries(p.utm as Record<string, unknown>)) {
      if (!UTM_KEYS.has(k)) throw new BadRequest('invalid');
      const s = str(val, 100).replace(/[^\w\-.~ +%]/g, '');
      if (s) utm[k] = s;
    }
  }

  const c = v.clean;
  const lead: Lead = {
    goal: c.goal,
    programs: c.programs,
    firstName: c.firstName,
    lastName: c.lastName,
    phone: c.phone,
    email: c.email,
    state: c.state,
    language: c.language,
    waitlist: c.waitlist,
    noEstimateClicked: p.noEstimateClicked === true,
    estimateAttachedNotSent: p.estimateAttachedNotSent === true,
    consent: {
      email: consentRecord(consent.email, CONSENT_TEXT.email),
      callsTexts: consentRecord(consent.callsTexts, CONSENT_TEXT.callsTexts)
    },
    pageUrl: cleanPageUrl(p.pageUrl),
    utm
  };

  const entry = form.get('estimate') as unknown as File | string | null;
  if (entry === null || typeof entry === 'string') return { spam: false, lead };

  // A file was sent. Refuse it when uploads are off or the person chose "Other state".
  if (!uploadsEnabled || lead.waitlist) throw new BadRequest('upload_not_accepted');
  if (entry.size === 0 || entry.size > MAX_FILE_BYTES) throw new BadRequest('file_size', 413);
  const bytes = new Uint8Array(await entry.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind) throw new BadRequest('file_type', 415);
  return { spam: false, lead, file: { bytes, kind, contentType: CONTENT_TYPES[kind] } };
}
