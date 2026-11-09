import { describe, it, expect } from 'vitest';
import { toE164US, isValidEmail, validateLead, checkUpload, looksLikeSpam } from '../../public/form-validation.js';

const STATES = ['CA', 'FL', 'MN', 'OR', 'TX', 'VA', 'WA'];
const base = { goal: 'buy', programs: ['not-sure'], name: 'Sam Doe', phone: '', email: 'sam@example.com', state: 'TX', language: 'English' };
const RULES = { maxBytes: 10 * 1024 * 1024, extensions: ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif'], mimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif'] };

describe('toE164US', () => {
  it('normalizes common formats', () => {
    for (const v of ['(214) 555-0123', '214-555-0123', '214.555.0123', '2145550123', '+1 214 555 0123', '1-214-555-0123'])
      expect(toE164US(v)).toBe('+12145550123');
  });
  it('rejects invalid numbers', () => {
    for (const v of ['', '555-0123', '123-456-7890', '214-055-0123', '+44 20 7946 0958', '22145550123', 'abc']) expect(toE164US(v)).toBeNull();
  });
});

describe('isValidEmail', () => {
  it('accepts normal addresses', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail(' name.last+tag@example.org ')).toBe(true);
  });
  it('rejects malformed', () => {
    for (const v of ['', 'a', 'a@b', 'a@b.c', 'a b@c.com', '@c.com', 'a@@b.com']) expect(isValidEmail(v)).toBe(false);
  });
});

describe('validateLead', () => {
  it('passes a valid lead with email only', () => {
    const r = validateLead(base, STATES);
    expect(r.ok).toBe(true);
    expect(r.clean).toMatchObject({ firstName: 'Sam', lastName: 'Doe', email: 'sam@example.com', phone: null, waitlist: false });
  });
  it('passes with phone only and normalizes it', () => {
    const r = validateLead({ ...base, email: '', phone: '(512) 555-0199' }, STATES);
    expect(r.ok).toBe(true);
    expect(r.clean.phone).toBe('+15125550199');
  });
  it('requires a name', () => {
    expect(validateLead({ ...base, name: '   ' }, STATES).errors.name).toMatch(/full name/);
  });
  it('requires phone or email', () => {
    const r = validateLead({ ...base, email: '', phone: '' }, STATES);
    expect(r.ok).toBe(false);
    expect(r.errors.phone).toMatch(/phone number or an email/);
  });
  it('flags a bad phone even when email is valid', () => {
    expect(validateLead({ ...base, phone: '12345' }, STATES).errors.phone).toMatch(/10-digit/);
  });
  it('flags a bad email even when phone is valid', () => {
    expect(validateLead({ ...base, phone: '2145550123', email: 'nope' }, STATES).errors.email).toMatch(/email address/);
  });
  it('limits state to licensed states plus OTHER', () => {
    expect(validateLead({ ...base, state: '' }, STATES).errors.state).toBeDefined();
    expect(validateLead({ ...base, state: 'NY' }, STATES).errors.state).toBeDefined();
    const other = validateLead({ ...base, state: 'OTHER' }, STATES);
    expect(other.ok).toBe(true);
    expect(other.clean.waitlist).toBe(true);
  });
  it('rejects an unknown goal and filters unknown programs', () => {
    expect(validateLead({ ...base, goal: 'sell' }, STATES).errors.goal).toBeDefined();
    expect(validateLead({ ...base, programs: ['x', 'ijara'] }, STATES).clean.programs).toEqual(['ijara']);
    expect(validateLead({ ...base, programs: [] }, STATES).clean.programs).toEqual(['not-sure']);
  });
  it('falls back to English for an unknown language', () => {
    expect(validateLead({ ...base, language: 'Klingon' }, STATES).clean.language).toBe('English');
  });
});

describe('checkUpload', () => {
  const f = (name, type, size = 1000) => ({ name, type, size });
  it('accepts pdf, jpg, png, heic', () => {
    expect(checkUpload(f('le.pdf', 'application/pdf'), RULES)).toBeNull();
    expect(checkUpload(f('le.JPG', 'image/jpeg'), RULES)).toBeNull();
    expect(checkUpload(f('le.png', 'image/png'), RULES)).toBeNull();
    expect(checkUpload(f('IMG_1.HEIC', ''), RULES)).toBeNull();
  });
  it('rejects other types', () => {
    expect(checkUpload(f('le.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'), RULES)).toMatch(/PDF, JPG, PNG or HEIC/);
    expect(checkUpload(f('le.pdf.exe', 'application/octet-stream'), RULES)).toMatch(/PDF/);
    expect(checkUpload(f('fake.pdf', 'text/html'), RULES)).toMatch(/PDF/);
  });
  it('enforces 10 MB and non-empty', () => {
    expect(checkUpload(f('le.pdf', 'application/pdf', 10 * 1024 * 1024), RULES)).toBeNull();
    expect(checkUpload(f('le.pdf', 'application/pdf', 10 * 1024 * 1024 + 1), RULES)).toMatch(/10 MB/);
    expect(checkUpload(f('le.pdf', 'application/pdf', 0), RULES)).toMatch(/empty/);
  });
});

describe('looksLikeSpam', () => {
  it('flags a filled honeypot', () => {
    expect(looksLikeSpam({ honeypot: 'http://x', loadedAt: 0, now: 10000, minMs: 3000 })).toBe(true);
  });
  it('flags a too-fast submit', () => {
    expect(looksLikeSpam({ honeypot: '', loadedAt: 0, now: 1000, minMs: 3000 })).toBe(true);
  });
  it('passes a normal submit', () => {
    expect(looksLikeSpam({ honeypot: '', loadedAt: 0, now: 5000, minMs: 3000 })).toBe(false);
  });
});
