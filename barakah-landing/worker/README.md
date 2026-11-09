# Barakah lead endpoint (Cloudflare Worker)

One Worker serves the static page (`../public`) and two routes:

| Route | What it does |
|---|---|
| `POST /api/lead` | Re-validates the form, optionally stores the Loan Estimate in private R2, upserts the GHL contact, adds tags, creates the opportunity, adds a note. Returns `{ok:true}` or `{ok:false,error:<code>}`. |
| `GET /api/estimate/<key>?exp&sig` | Serves a stored Loan Estimate only with a valid HMAC signature before `exp`, and only while the file is within the retention period. Everything else gets 404. |

## What gets written to GoHighLevel
- **Contact (upsert, matched by the location's duplicate rule):** first and last name, E.164 phone, email, state, country US, source "Barakah landing page".
- **Tags (added, existing tags are kept):** `barakah-lp`, `goal:buy|refi`, `program:<murabaha|musharakah|ijara|not-sure>`, `has-estimate:yes|no`, `needs-qualification-review` (no estimate), `state:other-waitlist`, `consent:email`, `consent:calls-texts`.
- **Custom fields:** language; one consent record per box (granted, ISO timestamp, page URL, IP, user agent, consent version, exact text shown, whether it matches the server copy); attribution (page URL + UTM).
- **DND (do not disturb):** lifted only for the channels the person checked (email, or call + SMS). An unchecked box never grants anything, and the endpoint never clears an existing opt-in.
  **Workflows must gate automated email/SMS/calls on the `consent:*` tags.**
- **Opportunity** in `GHL_PIPELINE_ID` / `GHL_STAGE_ID`. It is skipped for "Other state" waitlist leads.
- **Note** with the request summary and, if a file was uploaded, a signed link that expires (72 h by default). The file itself never goes to GHL or any other third party.

If the contact upsert fails, the uploaded file is deleted and the page shows the call-us message. If tags, the opportunity or the note fail after the contact exists, the lead still counts as received and `lead_partial` is logged.

## Setup
```bash
npm install
cp .dev.vars.example .dev.vars        # fill in GHL_TOKEN (private integration token) and GHL_LOCATION_ID
npm run ghl:check                     # read-only: confirms token + location, lists pipelines/stages and custom-field IDs
npm run ghl:create-fields             # only if fields are missing; prints the IDs it created
npx wrangler r2 bucket create barakah-loan-estimates
npx wrangler r2 bucket lifecycle add barakah-loan-estimates le-expire le/ --expire-days 30
for s in GHL_TOKEN GHL_LOCATION_ID GHL_PIPELINE_ID GHL_STAGE_ID ESTIMATE_LINK_SECRET \
         GHL_CF_LANGUAGE GHL_CF_CONSENT_EMAIL GHL_CF_CONSENT_CALLS GHL_CF_ATTRIBUTION; do npx wrangler secret put $s; done
# set ALLOWED_ORIGINS in wrangler.toml to the final https origin, then:
npm run deploy
```
The private integration token needs these scopes: contacts.write/readonly, opportunities.write/readonly, locations.readonly, locations/customFields.write/readonly.

## Launch switches (all off now)
| Switch | Where | Turn on when |
|---|---|---|
| `formLive` | `public/config.js` | Compliance approves the page and this Worker is deployed |
| `UPLOADS_ENABLED` + `sendEstimateFile` | `wrangler.toml` + `public/config.js` (must match) | Compliance approves storage, retention and the privacy text on the form |
| remove `noindex` | `public/index.html`, `public/_headers` | Launch |

## Tests
`npm test` runs 22 integration tests against a fake GHL and an in-memory R2 bucket. Any real network call fails the test.
The tests cover: the upsert, tag, opportunity and note payloads; that consent evidence is recorded; DND changes per box; rejection of unknown fields and parts; server-side re-validation; origin checks; rate limiting; the honeypot; the upload switch; real file-type checks; the 10 MB limit; the signed-link checks (tampered, unsigned, expired, past retention); the waitlist; GHL failure handling; and that the page's consent text matches the server copy.
`npm run typecheck` runs TypeScript.
