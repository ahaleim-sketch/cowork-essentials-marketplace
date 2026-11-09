# Pre-launch review: Barakah "Second Look" page

Review date: 2026-11-09 (handover Prompt 4). An independent reviewer read the compliance copy with no access to the builder's conclusions. The technical checks were run against the built site.
**Verdict: NOT ready to launch.** All code-only items are fixed. Eight business or compliance blockers remain. This is not legal advice: every item marked "confirm" needs Everett / Supreme Lending Compliance.

## A. Open items: business or Compliance decisions (sorted by severity)

| # | Severity | Item | Where | What is needed |
|---|---|---|---|---|
| 1 | Blocker | Everett Compliance has not approved the page copy, the consent text, the Murabaha disclosure (its "with the financier" wording is from the Rate era), or the program names. | `public/index.html`, `worker/src/consent.ts` | Written sign-off. If the consent wording changes, update both files and bump `CONSENT_VERSION`. A test fails if the page and the server copy differ. |
| 2 | Blocker | It is not confirmed that "Barakah Mortgage" is a trade name registered in NMLS for Everett in every state served. | `config.js` `brandName` | Confirm the DBA (handover open item 4). Until then, consider "Barakah Islamic home financing, offered by Everett Financial, Inc. D/B/A Supreme Lending". |
| 3 | Blocker | The phone, email and website are from the Rate era. | `config.js` | Replace with contact details Everett controls (open item 1). |
| 4 | Blocker | Program, reviews and board links point to the Bluehost staging host. The Ijara page slug is `program-arrive-eep`. | `config.js` `links` | Final URLs, and check that each page's program names match. |
| 5 | Blocker | The Privacy Policy and Terms / SMS Terms are stub pages. | `public/privacy.html`, `public/terms.html` | Replace with Everett's policies or link to them. CalOPPA requires a privacy policy, and SMS opt-in pages are expected to link both. |
| 6 | Blocker | Lead data and Loan Estimates would be stored in Cloudflare (D1 and R2) and emailed to an advisor inbox. | `worker/` | Everett must approve this data store under its Safeguards Rule and vendor program. `ALERT_TO` must be an Everett-managed mailbox. Set how long D1 leads are kept: consent rows for at least 4 years; R2 files are already set to 30 days. |
| 7 | Blocker | No state licensing statements appear. | Footer | Confirm the requirements for CA (DFPI/CRMLA), TX (SML complaint and recovery-fund notice), VA, WA, OR, FL and MN. Add the required text or a "State licensing" link. Some states may require the loan originator's name next to the NMLS ID, which conflicts with the no-name rule. |
| 8 | Blocker | "Nonrecourse protection: If a default occurs, we do not pursue your other assets." This is an absolute claim about what happens on default (UDAAP / Reg N). | `index.html` differentiators | Substantiate it for every program and state and qualify it, or remove it. |
| 9 | High | "Shared risk: the risks of owning the home are shared." The same claim appears in the Musharakah card. It may overstate how risk is allocated. | `index.html` | Rewrite to match the contract, or remove. |
| 10 | High | The calendar link contains the advisor's personal name (`calendly.com/ahmedbadri`). | `config.js` `calendarUrl` | Use a team or brand scheduling link, or remove it. |
| 11 | Medium | The calls/texts consent says "about home financing" but not "marketing", and names Everett while the page brand is Barakah. | consent text | Confirm the wording meets prior express written consent requirements, including the FL, TX, VA and WA telemarketing rules. |
| 12 | Medium | There are no product disclosures for Musharakah and Ijara. "Low starting down payment" is not a Reg Z triggering term (no amount or percent), but it must be accurate. | `index.html` | Approved disclosures, or confirm the program pages carry them. |
| 13 | Medium | No physical postal address. | `config.js` `address` | Required before any marketing email (CAN-SPAM). Open item 2. |
| 14 | Low | "Free and carries no obligation" and "An advisor answers directly". | FAQ, contact band | Confirm both are true (no fee or credit pull at review; a staffed line), or soften. |
| 15 | Low | The hero photo is AI-generated. | Hero | Decide whether to add an "Illustrative image" note (open item 5). |
| 16 | Low | There is no Equal Housing logo; the text is present. | Footer | Optional. Supply the official logo file if wanted. |

## B. Fixed in this pass (code only)

| Finding | Fix |
|---|---|
| "Let us show you what you qualify for" implied the person qualifies. | Now "…what you **may** qualify for." The handover's safer wording, still subject to Compliance. |
| The FAQ said "Barakah serves many states", which conflicts with the 7-state list. | Now lists the licensed states from `config.js`. |
| No privacy or terms links. | Added links under the consent boxes and in the footer, plus stub pages marked TODO (see A5). |
| The form did not say what happens to an attached Loan Estimate. | Both dropzones now say so, driven by `sendEstimateFile`: "Stays on this device…", or, once uploads are on, "goes securely to your advisor only and is deleted after 30 days". With uploads off, the success message adds "Please have your Loan Estimate ready for the call." |
| "Other state" visitors could consent to calls and texts. | The calls/texts box is hidden and unchecked when "Other state" is chosen. |
| The alert email trusted a consent even if the wording shown did not match, and did not warn when email consent was missing. | A mismatch now shows as "NO (… treat as no consent)". The email warns separately for marketing email and for calls/texts. |
| The NMLS link went to the home page. | Now goes straight to the company record for NMLS #2129. |
| The favicon returned 404 (a console error). | Added `img/favicon.svg`. |
| Fonts were loaded from Google (render-blocking, and each visitor's IP went to Google). | Fonts are self-hosted (SIL OFL). No third-party requests remain. CSP tightened to `font-src 'self'`. |

## C. Passes

**Advertising:** no Reg Z triggering terms (rates, payments, amounts or percentages down, terms, finance charges). There are no claims about cost, savings, speed, approval odds or guarantees. "Loan", "interest" and "lender" appear only in the allowed places. No Arabic text and no personal name in page copy (the calendar URL is item A10). "Open to all qualified applicants regardless of religion or national origin" is present.

**Disclosures present:** the company name with NMLS #2129, advisor NMLS #2753124, "Equal Housing Lender", nmlsconsumeraccess.org, the Murabaha disclosure, and the "not a quote" note under the worksheet, which is always visible.

**Consent:** two separate boxes, unchecked and not required. They name the right legal entity and include STOP/HELP, frequency, "rates may apply" and "not a condition of purchase". Server-side evidence per box records timestamp, IP, user agent, page URL, exact text, version and whether the text matched; it is written all or nothing. Nothing sends automated calls or texts.

**Privacy:** no personal data in URLs (the query string is dropped), logs (only the lead id), email subjects or headers. No analytics or pixels. Uploads are off by default. Files are type-checked by content, stored under random keys, and reachable only through signed links that expire and stop working after the retention period. `noindex` is set in the page and in the headers.

**Technical:**

| Check | Result |
|---|---|
| Lighthouse, mobile (local server, uncompressed) | Performance 97, Accessibility 100, Best Practices 100, SEO 63 |
| Lighthouse, desktop | Performance 100, Accessibility 100, Best Practices 100, SEO 63 |
| SEO 63 | Only fails "Page is blocked from indexing", which is the deliberate `noindex`. Removing it at launch should restore the score. |
| Core Web Vitals | CLS 0, TBT 0 ms, LCP 0.6 s desktop / about 2.2 s simulated slow 4G |
| Console errors | None |
| Third-party requests | None |
| Widths 360, 390, 768, 1024, 1280, 1440, light and dark | No horizontal scroll |
| Keyboard only | Logical tab order. Arrow keys move between radios. Space toggles chips. Enter submits, and focus moves to the first error. Focus is visible on every control. |
| Reduced motion | CTA animation off |
| Target size | Every interactive control is at least 24 px (WCAG 2.5.8). Form controls are at least 44 px. Only inline text links are smaller, which WCAG exempts. |
| axe WCAG 2.2 AA | 0 violations, light and dark, including error and unlocked states |
| Program and review links (staging) | All return HTTP 200 |
| barakahmortgage.com, Calendly, nmlsconsumeraccess.org | Not verified: the build sandbox's network blocks these hosts. Check them by hand. |

**Tests at this commit:** 26 Worker tests, 33 unit tests and 52 browser tests, all passing.
