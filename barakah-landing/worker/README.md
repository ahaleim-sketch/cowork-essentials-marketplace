# Barakah lead endpoint (Cloudflare Worker)

One Worker serves the static page (`../public`) and two routes. Leads stay in your Cloudflare account: no CRM and no third party.

| Route | What it does |
|---|---|
| `POST /api/lead` | Re-validates the form, optionally stores the Loan Estimate in private R2, saves the lead and both consent records to D1, then emails the advisor. Returns `{ok:true}` or `{ok:false,error:<code>}`. |
| `GET /api/estimate/<key>?exp&sig` | Serves a stored Loan Estimate only with a valid HMAC signature before `exp`, and only while the file is within the retention period. Everything else gets 404. |

## Where a lead goes
1. **D1 `leads`**: name, E.164 phone, email, state, language, goal, programs, estimate flags, page URL, UTM, `status` (starts `new`), `alert_sent`.
2. **D1 `consents`**: one row per box, checked or not, with granted, timestamp, page URL, IP, user agent, consent version, the exact text shown, and whether it matches the server copy. This is your TCPA/CAN-SPAM evidence: keep it as long as Compliance says, at least 4 years.
   The lead and its consents are written in one batch, so either all rows are saved or none are.
3. **Email to `ALERT_TO`** through Cloudflare Email Routing. The subject has no personal data (it shows in lock-screen previews). The body has the contact details, the consent answers (with "Do not add this person to automated calls or texts" when that box was not checked), and, if a file was uploaded, a signed link that expires (72 h by default). The file itself is never emailed.

If saving to D1 fails, the uploaded file is deleted and the page shows the call-us message. If the email fails, the lead is still saved, `alert_sent` stays 0, and `npm run leads -- unsent` lists it.

## Working with leads
```bash
npm run leads -- list 7              # last 7 days
npm run leads -- unsent              # leads whose email alert failed
npm run leads -- link <leadId>       # fresh 24 h Loan Estimate link (needs ESTIMATE_LINK_SECRET + SITE_ORIGIN in .dev.vars)
npm run leads -- mark <leadId> contacted
npm run leads -- export leads.csv    # every lead with both consent records (personal data: store securely)
```
Add `--local` to read the `wrangler dev` database instead of production.

## Setup
Prerequisite: the sending domain uses Cloudflare DNS with **Email Routing** turned on, and the advisor inbox (`ALERT_TO`) is added and verified as a destination address.
```bash
npm install
npx wrangler d1 create barakah-leads          # paste the database_id into wrangler.toml
npm run db:migrate
npx wrangler r2 bucket create barakah-loan-estimates
npx wrangler r2 bucket lifecycle add barakah-loan-estimates le-expire le/ --expire-days 30
openssl rand -base64 32 | npx wrangler secret put ESTIMATE_LINK_SECRET   # also put it in your local .dev.vars for `leads link`
# set ALLOWED_ORIGINS, ALERT_FROM, ALERT_TO in wrangler.toml, then:
npm run deploy
```

## Launch switches (all off now)
| Switch | Where | Turn on when |
|---|---|---|
| `formLive` | `public/config.js` | Compliance approves the page and this Worker is deployed |
| `UPLOADS_ENABLED` + `sendEstimateFile` | `wrangler.toml` + `public/config.js` (must match) | Compliance approves storage, retention and the privacy text on the form |
| remove `noindex` | `public/index.html`, `public/_headers` | Launch |

## Tests
`npm test` runs 24 tests. They use the real migration on SQLite, a fake email sender and an in-memory R2 bucket, and any network call fails the test.
They cover: what is saved to D1 (lead plus consent evidence); that a lead and its consents are written together or not at all; what is in the alert (and kept out of the subject and headers); email failure; database failure (cleanup); rejection of unknown fields and parts; server-side re-validation; SQL-looking input; origin checks; rate limiting; the honeypot; the upload switch; real file-type checks; the 10 MB limit; the signed-link checks (tampered, unsigned, expired, past retention); that CLI re-signed links are accepted; the waitlist; and that the page's consent text matches the server copy.
`npm run typecheck` runs TypeScript.
