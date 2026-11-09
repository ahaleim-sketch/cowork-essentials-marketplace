// Page wiring: config values, lead form behavior, validation and submit.
import { validateLead, looksLikeSpam, OTHER_STATE } from './form-validation.js';
import { initAttachment, getFile, clearFile } from './attachment.js';

const cfg = window.BARAKAH_CONFIG;
const loadedAt = Date.now();
const $ = (id) => document.getElementById(id);
const get = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), cfg);

/* ---------- config binding ---------- */
function bindConfig() {
  document.querySelectorAll('[data-cfg]').forEach((el) => {
    el.textContent = get(el.dataset.cfg) ?? '';
  });
  document.querySelectorAll('[data-cfg-href]').forEach((el) => {
    const url = get(el.dataset.cfgHref);
    if (url) el.setAttribute('href', url);
    else el.hidden = true;
  });
  const addr = document.querySelector('[data-cfg-address]');
  if (addr && cfg.address) {
    addr.textContent = ' ' + cfg.address;
    addr.hidden = false;
  }
  const st = $('st');
  const other = st.querySelector(`option[value="${OTHER_STATE}"]`);
  for (const [code, name] of cfg.licensedStates) {
    const o = document.createElement('option');
    o.value = code;
    o.textContent = name;
    st.insertBefore(o, other);
  }
  $('preview-note').hidden = Boolean(cfg.formLive);

  // Say plainly what happens to an attached Loan Estimate (privacy).
  const kept = 'Stays on this device. It is not sent with the form.';
  const sent = `If you send the form, it goes securely to your advisor only and is deleted after ${cfg.estimateRetentionDays} days.`;
  const hero = document.querySelector('[data-upload-note="hero"]');
  const ws = document.querySelector('[data-upload-note="ws"]');
  if (hero) hero.textContent = 'Optional. ' + (cfg.sendEstimateFile ? sent : kept);
  // With uploads on, the review-before-the-call offer leads the upload box.
  $('upintro').hidden = !cfg.sendEstimateFile;
  $('d1').classList.toggle('feature', Boolean(cfg.sendEstimateFile));
  if (cfg.sendEstimateFile) $('d1').querySelector('b').textContent = 'Upload your Loan Estimate';
  if (ws) ws.textContent = 'PDF, photo or screenshot. ' + (cfg.sendEstimateFile ? 'It is sent only if you also send the form above.' : kept);

  const states = document.querySelector('[data-cfg-states]');
  if (states) {
    const names = cfg.licensedStates.map(([, n]) => n);
    states.textContent = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names.at(-1) : names.join('');
  }
}

/* ---------- program chips: "Not sure yet" is exclusive ---------- */
function bindPrograms() {
  const notSure = $('p4');
  ['p1', 'p2', 'p3'].forEach((id) =>
    $(id).addEventListener('change', function () {
      if (this.checked) notSure.checked = false;
    })
  );
  notSure.addEventListener('change', function () {
    if (this.checked) ['p1', 'p2', 'p3'].forEach((id) => ($(id).checked = false));
  });
}

/* ---------- errors ---------- */
const FIELD = { goal: 'g1', name: 'nm', phone: 'ph', email: 'em', state: 'st' };
const ORDER = ['goal', 'name', 'phone', 'email', 'state'];

function setFieldError(key, message) {
  const input = $(FIELD[key]);
  const err = $(FIELD[key] + '-err');
  if (err) err.textContent = message || '';
  if (!input) return;
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
}

function clearErrors() {
  ORDER.forEach((k) => setFieldError(k, ''));
}

/* ---------- status line ---------- */
function status(text, kind, withPhone) {
  const m = $('msg');
  m.className = 'msg' + (kind ? ' ' + kind : '');
  m.textContent = text;
  if (withPhone) {
    const a = document.createElement('a');
    a.href = 'tel:' + cfg.phoneE164;
    a.textContent = cfg.phoneDisplay;
    m.append(' ', a, '.');
  }
}

/* ---------- state select ---------- */
function bindState() {
  const st = $('st');
  st.addEventListener('change', () => {
    const waitlist = st.value === OTHER_STATE;
    $('waitlist').hidden = !waitlist;
    $('upwrap').hidden = waitlist;
    // No calls or texts to residents of states where Barakah is not licensed.
    $('c2-label').hidden = waitlist;
    if (waitlist) $('c2').checked = false;
    if (st.value) setFieldError('state', '');
  });
}

/* ---------- read form ---------- */
function readForm() {
  const form = $('lead');
  return {
    goal: form.querySelector('input[name="goal"]:checked')?.value,
    programs: [...form.querySelectorAll('input[name="program"]:checked')].map((i) => i.value),
    name: $('nm').value,
    phone: $('ph').value,
    email: $('em').value,
    state: $('st').value,
    language: $('lg').value,
    honeypot: $('website').value,
    consentEmail: $('c1').checked,
    consentCalls: $('c2').checked
  };
}

let noEstimateClicked = false;

function utm() {
  const out = {};
  const q = new URLSearchParams(location.search);
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const v = q.get(k);
    if (v) out[k] = v.slice(0, 100);
  }
  return out;
}

/** Build the request body. Exported for tests through the window hook below. */
function buildPayload(clean, raw, file) {
  return {
    goal: clean.goal,
    programs: clean.programs,
    firstName: clean.firstName,
    lastName: clean.lastName,
    phone: clean.phone,
    email: clean.email,
    state: clean.state,
    language: clean.language,
    waitlist: clean.waitlist,
    hasEstimate: Boolean(file),
    estimateAttachedNotSent: Boolean(!file && getFile()),
    noEstimateClicked,
    consent: {
      email: { granted: raw.consentEmail, text: $('c1-text').textContent.trim() },
      callsTexts: { granted: raw.consentCalls, text: $('c2-text').textContent.trim() }
    },
    // Path only. Never put names, phone or amounts in URLs.
    pageUrl: location.origin + location.pathname,
    utm: utm(),
    clientSubmittedAt: new Date().toISOString()
  };
}

async function onSubmit(e) {
  e.preventDefault();
  const raw = readForm();
  clearErrors();

  const { ok, errors, clean } = validateLead(raw, cfg.licensedStates.map(([c]) => c));
  if (!ok) {
    ORDER.forEach((k) => errors[k] && setFieldError(k, errors[k]));
    const first = ORDER.find((k) => errors[k]);
    const n = Object.keys(errors).length;
    status(n === 1 ? 'Please fix the highlighted field.' : `Please fix the ${n} highlighted fields.`, 'bad');
    $(FIELD[first])?.focus();
    return;
  }

  if (looksLikeSpam({ honeypot: raw.honeypot, loadedAt, now: Date.now(), minMs: cfg.minMsOnPage })) {
    // Look successful to the bot; send nothing.
    status('Thank you. An advisor will contact you.', 'ok');
    return;
  }

  // "Other state" never sends a document.
  const file = clean.waitlist || !cfg.sendEstimateFile ? null : getFile();

  if (!cfg.formLive) {
    status(
      'Preview only: nothing was sent, including any uploaded document. Call ' + cfg.phoneDisplay + ' to reach an advisor now.',
      ''
    );
    return;
  }

  const btn = $('go');
  const label = btn.textContent;
  btn.disabled = true;
  btn.setAttribute('aria-busy', 'true');
  btn.textContent = 'Sending…';
  status('Sending your request…', '');

  try {
    const body = new FormData();
    body.append('payload', JSON.stringify(buildPayload(clean, raw, file)));
    body.append('website', raw.honeypot);
    if (file) body.append('estimate', file, file.name);
    const res = await fetch(cfg.leadEndpoint, { method: 'POST', body, credentials: 'same-origin' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.ok !== true) throw new Error('rejected');
    const keptEstimate = !file && getFile() && !clean.waitlist;
    status('Thank you. An advisor will contact you.' + (keptEstimate ? ' Please have your Loan Estimate ready for the call.' : ''), 'ok');
    $('lead').reset();
    clearFile();
    $('waitlist').hidden = true;
    $('upwrap').hidden = false;
    $('c2-label').hidden = false;
  } catch {
    status('We could not send your request. Please call', 'bad', true);
  } finally {
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
    btn.textContent = label;
  }
}

function bindForm() {
  $('lead').addEventListener('submit', onSubmit);
  $('nm').addEventListener('input', () => setFieldError('name', ''));
  ['ph', 'em'].forEach((id) =>
    $(id).addEventListener('input', () => {
      setFieldError('phone', '');
      setFieldError('email', '');
    })
  );
  $('noest').addEventListener('click', (e) => {
    e.preventDefault();
    noEstimateClicked = true;
    $('nm').focus();
  });
}

bindConfig();
bindPrograms();
bindState();
bindForm();
initAttachment();
