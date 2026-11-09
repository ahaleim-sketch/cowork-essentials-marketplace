import { describe, it, expect } from 'vitest';
import { parseFigure, computeMetrics, formatMetric, QUESTIONS } from '../../public/worksheet-core.js';

const finite = (m) =>
  ['aprSpread', 'originationPct', 'pointsPct', 'closingPct'].every((k) => m[k] === null || Number.isFinite(m[k]));

describe('parseFigure', () => {
  it('strips $ , % and spaces', () => {
    expect(parseFigure('$ 350,000')).toBe(350000);
    expect(parseFigure('6.875%')).toBe(6.875);
    expect(parseFigure(' 1 234.50 ')).toBe(1234.5);
  });
  it('returns null for blank and non-numeric input', () => {
    for (const v of ['', '   ', null, undefined, 'abc', '12a', '1.2.3', '--5', '$', '%']) expect(parseFigure(v)).toBeNull();
  });
  it('never returns NaN or Infinity', () => {
    expect(parseFigure('1e400')).toBeNull();
    expect(parseFigure('9'.repeat(400))).toBeNull();
  });
  it('accepts .5 and 5.', () => {
    expect(parseFigure('.5')).toBe(0.5);
    expect(parseFigure('5.')).toBe(5);
  });
});

describe('computeMetrics', () => {
  it('is not ready when amount is zero, negative or blank', () => {
    for (const amount of ['0', '-100', '', 'abc', undefined]) {
      const m = computeMetrics({ amount, rate: '6', apr: '6.2', origination: '1000' });
      expect(m.ready).toBe(false);
      expect(m.originationPct).toBeNull();
    }
    expect(computeMetrics().ready).toBe(false);
  });

  it('computes the four metrics', () => {
    const m = computeMetrics({ amount: '$400,000', rate: '6.5%', apr: '6.731%', origination: '$4,000', points: '2,000', closing: '$12,345' });
    expect(m).toEqual({ ready: true, aprSpread: 0.23, originationPct: 1, pointsPct: 0.5, closingPct: 3.09 });
  });

  it('leaves blank fields as null instead of zero', () => {
    const m = computeMetrics({ amount: '300000', apr: '7' });
    expect(m.ready).toBe(true);
    expect(m.aprSpread).toBeNull(); // rate missing
    expect(m.originationPct).toBeNull();
    expect(m.pointsPct).toBeNull();
    expect(m.closingPct).toBeNull();
  });

  it('treats an explicit 0 as zero', () => {
    expect(computeMetrics({ amount: '100000', points: '0' }).pointsPct).toBe(0);
  });

  it('handles APR below the stated rate (negative spread, no judgement)', () => {
    expect(computeMetrics({ amount: '100000', rate: '7', apr: '6.85' }).aprSpread).toBe(-0.15);
  });

  it('rounds to two decimals correctly', () => {
    expect(computeMetrics({ amount: '300000', closing: '3015' }).closingPct).toBe(1.01); // 1.005 -> 1.01
    expect(computeMetrics({ amount: '3', origination: '1' }).originationPct).toBe(33.33);
    expect(computeMetrics({ amount: '100000', rate: '6.1', apr: '6.3' }).aprSpread).toBe(0.2);
  });

  it('stays finite with very large and very small amounts', () => {
    const big = computeMetrics({ amount: '999,999,999,999', origination: '1', closing: '999999999999' });
    expect(finite(big)).toBe(true);
    expect(big.closingPct).toBe(100);
    const tiny = computeMetrics({ amount: '0.0001', closing: '1e300'.replace('e300', '0'.repeat(300)) });
    expect(finite(tiny)).toBe(true);
  });

  it('ignores garbage in optional fields', () => {
    const m = computeMetrics({ amount: '200000', rate: 'six', apr: '6.5', origination: 'n/a' });
    expect(m.aprSpread).toBeNull();
    expect(m.originationPct).toBeNull();
  });
});

describe('formatMetric', () => {
  it('formats points and percents', () => {
    expect(formatMetric(0.2, 'pts')).toBe('0.20 pts');
    expect(formatMetric(3.09, '%')).toBe('3.09%');
    expect(formatMetric(null, '%')).toBe('—');
  });
});

describe('questions', () => {
  it('has exactly the three neutral questions', () => {
    expect(QUESTIONS).toEqual([
      'Are the origination charges fixed before closing?',
      'Which fees can I shop for, and which were chosen for me?',
      'What would this same file look like as riba-free financing?'
    ]);
  });
});
