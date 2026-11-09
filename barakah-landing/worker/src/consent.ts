// The consent wording exactly as shown in public/index.html.
// A test checks that the page and this file match. If Compliance changes the
// wording, change both and bump the version.
export const CONSENT_VERSION = '2026-11-09';

export const CONSENT_TEXT = {
  email:
    'I agree to receive marketing emails about home financing from Everett Financial, Inc. D/B/A Supreme Lending (NMLS #2129). I can unsubscribe at any time. Consent is not required to obtain any product or service.',
  callsTexts:
    'I agree that Everett Financial, Inc. D/B/A Supreme Lending (NMLS #2129) and its mortgage advisors may call and text me at the number I provided, including using an automatic telephone dialing system or prerecorded or artificial voice messages, about home financing. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of any purchase or of obtaining any product or service.'
} as const;
