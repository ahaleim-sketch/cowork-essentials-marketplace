// Pure arithmetic for the "Compare it yourself" worksheet.
// Arithmetic only: no judgement, benchmark, savings estimate or program comparison.

/**
 * Parse a user-typed figure. Strips $ , % and spaces. Returns null for blank
 * or non-numeric input. Never returns NaN or Infinity.
 */
export function parseFigure(input) {
  const s = String(input ?? '').replace(/[\s$,%]/g, '');
  if (s === '') return null;
  // Accept an optional leading minus, digits and at most one decimal point.
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const round2 = (x) => {
  const r = Math.round((x + Number.EPSILON) * 100) / 100;
  return Object.is(r, -0) ? 0 : r;
};

function share(part, amount) {
  if (part === null) return null;
  const r = (part / amount) * 100;
  return Number.isFinite(r) ? round2(r) : null;
}

/**
 * @param {{amount?, rate?, apr?, origination?, points?, closing?}} raw - strings or numbers
 * @returns {{ ready: boolean, aprSpread: number|null, originationPct: number|null,
 *             pointsPct: number|null, closingPct: number|null }}
 *   ready is false when the financing amount is missing or not above zero.
 *   A metric is null when its inputs are blank.
 */
export function computeMetrics(raw = {}) {
  const amount = parseFigure(raw.amount);
  const rate = parseFigure(raw.rate);
  const apr = parseFigure(raw.apr);
  const origination = parseFigure(raw.origination);
  const points = parseFigure(raw.points);
  const closing = parseFigure(raw.closing);

  const empty = { ready: false, aprSpread: null, originationPct: null, pointsPct: null, closingPct: null };
  if (amount === null || amount <= 0) return empty;

  const spread = rate !== null && apr !== null ? round2(apr - rate) : null;

  return {
    ready: true,
    aprSpread: spread !== null && Number.isFinite(spread) ? spread : null,
    originationPct: share(origination, amount),
    pointsPct: share(points, amount),
    closingPct: share(closing, amount)
  };
}

/** Format a metric for display. Blank inputs show an em dash. */
export function formatMetric(value, unit) {
  if (value === null || value === undefined) return '—';
  return value.toFixed(2) + (unit === 'pts' ? ' pts' : '%');
}

export const QUESTIONS = Object.freeze([
  'Are the origination charges fixed before closing?',
  'Which fees can I shop for, and which were chosen for me?',
  'What would this same file look like as riba-free financing?'
]);

export const EMPTY_MESSAGE = 'Enter the figures from your estimate to see the arithmetic.';
