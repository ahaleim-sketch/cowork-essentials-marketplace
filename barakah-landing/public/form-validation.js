// Pure validation helpers for the lead form. No DOM access, so they can be unit tested.

/**
 * Normalize a US phone number to E.164 (+1XXXXXXXXXX).
 * Returns null when the input is not a valid NANP number.
 */
export function toE164US(input) {
  const digits = String(input ?? '').replace(/\D/g, '');
  let national;
  if (digits.length === 10) national = digits;
  else if (digits.length === 11 && digits[0] === '1') national = digits.slice(1);
  else return null;
  // NANP: area code and exchange cannot start with 0 or 1.
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(national)) return null;
  return '+1' + national;
}

// Deliberately simple: one @, a dot in the domain, no spaces.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(input) {
  const v = String(input ?? '').trim();
  return v.length <= 254 && EMAIL_RE.test(v);
}

export const PROGRAMS = ['murabaha', 'musharakah', 'ijara', 'not-sure'];
export const LANGUAGES = ['English', 'Arabic', 'Urdu', 'Other'];
export const OTHER_STATE = 'OTHER';

/**
 * Validate the lead form values.
 * @param {object} v - { goal, programs[], name, phone, email, state, language }
 * @param {string[]} licensedStates - 2-letter codes
 * @returns {{ ok: boolean, errors: Record<string,string>, clean: object }}
 */
export function validateLead(v, licensedStates) {
  const errors = {};
  const name = String(v.name ?? '').trim().replace(/\s+/g, ' ');
  const phoneRaw = String(v.phone ?? '').trim();
  const emailRaw = String(v.email ?? '').trim();
  const state = String(v.state ?? '');

  if (v.goal !== 'buy' && v.goal !== 'refi') errors.goal = 'Choose Buy a home or Refinance.';

  if (!name) errors.name = 'Enter your full name.';
  else if (name.length > 120) errors.name = 'Name is too long.';

  let phone = null;
  if (phoneRaw) {
    phone = toE164US(phoneRaw);
    if (!phone) errors.phone = 'Enter a 10-digit US phone number, for example 555-123-4567.';
  }
  if (emailRaw && !isValidEmail(emailRaw)) {
    errors.email = 'Enter an email address like name@example.com.';
  }
  if (!phoneRaw && !emailRaw) {
    errors.phone = 'Enter a phone number or an email so an advisor can reach you.';
  }

  if (!state) errors.state = 'Choose your state.';
  else if (state !== OTHER_STATE && !licensedStates.includes(state)) errors.state = 'Choose your state from the list.';

  const language = LANGUAGES.includes(v.language) ? v.language : 'English';
  const programs = (Array.isArray(v.programs) ? v.programs : []).filter((p) => PROGRAMS.includes(p));

  const parts = name.split(' ');
  const clean = {
    goal: v.goal,
    programs: programs.length ? programs : ['not-sure'],
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
    name,
    phone,
    email: emailRaw ? emailRaw.toLowerCase() : null,
    state,
    language,
    waitlist: state === OTHER_STATE
  };

  return { ok: Object.keys(errors).length === 0, errors, clean };
}

/**
 * Client-side file check. Does not read file contents.
 * @param {{name:string,size:number,type:string}} file
 * @param {{maxBytes:number, extensions:string[], mimeTypes:string[]}} rules
 * @returns {string|null} error message or null
 */
export function checkUpload(file, rules) {
  if (!file) return null;
  const ext = String(file.name || '').split('.').pop().toLowerCase();
  const typeOk = rules.mimeTypes.includes(file.type);
  const extOk = rules.extensions.includes(ext);
  // HEIC often arrives with an empty MIME type, so accept a matching extension.
  if (!extOk || (file.type && !typeOk)) return 'Attach a PDF, JPG, PNG or HEIC file.';
  if (file.size > rules.maxBytes) return 'That file is larger than 10 MB. Attach a smaller file.';
  if (file.size === 0) return 'That file is empty. Attach your Loan Estimate again.';
  return null;
}

/** Returns true when the submission looks automated. */
export function looksLikeSpam({ honeypot, loadedAt, now, minMs }) {
  if (String(honeypot ?? '').trim() !== '') return true;
  return now - loadedAt < minMs;
}
