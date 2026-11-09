// "Compare it yourself" worksheet. Arithmetic only.
// Locked until a Loan Estimate is attached (hero form or this dropzone).
import { computeMetrics, formatMetric, QUESTIONS, EMPTY_MESSAGE } from './worksheet-core.js';
import { onChange } from './attachment.js';

const $ = (id) => document.getElementById(id);
const FIELDS = { amount: 'amt', rate: 'rate', apr: 'apr', origination: 'orig', points: 'pts', closing: 'cc' };

const ROWS = [
  ['APR minus stated rate', 'aprSpread', 'pts'],
  ['Origination charges as % of amount', 'originationPct', '%'],
  ['Points as % of amount', 'pointsPct', '%'],
  ['Closing costs as % of amount', 'closingPct', '%']
];

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function render() {
  const raw = {};
  for (const [key, id] of Object.entries(FIELDS)) raw[key] = $(id).value;
  const m = computeMetrics(raw);
  const out = $('out');
  out.replaceChildren();

  if (!m.ready) {
    out.append(el('p', 'fine', EMPTY_MESSAGE));
    return;
  }
  for (const [label, key, unit] of ROWS) {
    const row = el('div', 'm');
    row.append(el('span', null, label), el('b', null, formatMetric(m[key], unit)));
    out.append(row);
  }
  const qs = el('ul', 'qs');
  QUESTIONS.forEach((q) => qs.append(el('li', null, q)));
  out.append(qs);
}

function clearFields() {
  Object.values(FIELDS).forEach((id) => ($(id).value = ''));
  render();
}

function setLocked(locked) {
  $('gate').hidden = !locked;
  $('wsb').hidden = locked;
  if (locked) clearFields();
}

Object.values(FIELDS).forEach((id) => $(id).addEventListener('input', render));
$('ws').addEventListener('submit', (e) => e.preventDefault());
$('ws-reset').addEventListener('click', () => {
  clearFields();
  $('amt').focus();
});

onChange((file) => setLocked(!file));
setLocked(true);
