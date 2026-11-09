// The advisor alert email. The subject carries no personal data (it shows in
// notification previews); details are in the body only.
import type { Lead } from './validate';

const PROGRAM_NAME: Record<string, string> = {
  murabaha: 'Cost plus Profit (Murabaha)',
  musharakah: 'Diminishing Partnership (Musharakah)',
  ijara: 'Home Earned Equity (Ijara)',
  'not-sure': 'Not sure yet'
};

export function buildAlert(id: string, lead: Lead, at: string, estimate: { link: string; ttlHours: number } | null) {
  const goal = lead.goal === 'buy' ? 'Buy a home' : 'Refinance';
  const subject = lead.waitlist ? `Barakah waitlist request (other state)` : `New Barakah lead: ${goal} (${lead.state})`;
  // A consent only counts if the person saw the approved wording.
  const ok = (c: Lead['consent']['email']) => c.granted && c.textMatchesServer;
  const consent = (c: Lead['consent']['email']) =>
    ok(c) ? 'yes' : c.granted ? 'NO (box checked, but the wording shown does not match the approved text; treat as no consent)' : 'NO';
  const estimateLine = estimate
    ? `Loan Estimate: ${estimate.link}\n  (private link, expires in ${estimate.ttlHours} hours; run "npm run leads -- link ${id}" for a new one)`
    : lead.estimateAttachedNotSent
      ? 'Loan Estimate: they have one (attached on the page, not uploaded while uploads are off). Ask them to bring it.'
      : lead.noEstimateClicked
        ? 'Loan Estimate: none. They clicked "No estimate yet?"'
        : 'Loan Estimate: none attached.';

  const text = [
    lead.waitlist ? 'Waitlist request. Barakah is not offered in their state yet.' : 'A new request came in from the Barakah landing page.',
    '',
    `Name:      ${[lead.firstName, lead.lastName].filter(Boolean).join(' ')}`,
    `Phone:     ${lead.phone ?? '(none)'}`,
    `Email:     ${lead.email ?? '(none)'}`,
    `State:     ${lead.waitlist ? 'Other (not licensed)' : lead.state}`,
    `Language:  ${lead.language}`,
    `Goal:      ${goal}`,
    `Programs:  ${lead.programs.map((p) => PROGRAM_NAME[p]).join(', ')}`,
    '',
    `Marketing email consent:        ${consent(lead.consent.email)}`,
    `Calls/texts (autodialer) consent: ${consent(lead.consent.callsTexts)}`,
    ...(ok(lead.consent.email) ? [] : ['Do not add this person to marketing emails.']),
    ...(ok(lead.consent.callsTexts) ? [] : ['Do not add this person to automated calls or texts.']),
    '',
    estimateLine,
    '',
    `Received:  ${at}`,
    `Lead ID:   ${id}`
  ].join('\n');

  return { subject, text };
}

const b64 = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};

/** Builds a plain-text RFC 5322 message. Only server-controlled values go into headers. */
export function toMime(from: string, to: string, subject: string, text: string, now = new Date()) {
  const domain = from.split('@')[1] || 'localhost';
  const body = b64(text.replace(/\r?\n/g, '\r\n')).replace(/.{76}/g, '$&\r\n');
  return [
    `From: Barakah Landing Page <${from}>`,
    `To: <${to}>`,
    `Subject: =?UTF-8?B?${b64(subject)}?=`,
    `Date: ${now.toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    body
  ].join('\r\n');
}
