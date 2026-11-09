# Barakah "Second Look" landing page

Production build of the Barakah landing page and the Loan Estimate worksheet, made from the v12 design preview (`reference/barakah.html`).
The rules for copy, compliance and open items are in `docs/HANDOVER.md`, which is the source of truth.

**Status: not cleared for launch.** The form sends nothing (`formLive: false`), the page is `noindex`, and the values marked TODO in `public/config.js` still need confirming. Everett / Supreme Lending Compliance must approve the page before it goes live.

## Layout

```
public/
  index.html          page markup (copy taken word for word from the preview)
  styles.css          preview CSS, unchanged, with production additions at the end
  config.js           every business value (phone, email, links, states, formLive), TODO-marked
  app.js              fills in config values, runs the lead form, validates and submits
  attachment.js       one shared Loan Estimate file for both dropzones (the file is never read)
  form-validation.js  pure validation: E.164 phone, email, state, upload, spam checks
  worksheet-core.js   pure worksheet arithmetic: computeMetrics()
  worksheet.js        worksheet UI: locked/unlocked, Start over
  img/hero.webp|jpg   hero photo taken out of the preview (520x392)
scripts/serve.mjs     local static server (no dependencies)
scripts/screenshots.mjs  screenshots at 390 and 1280 px, light and dark
tests/unit            Vitest: validation and worksheet arithmetic
tests/e2e             Playwright: form, upload, worksheet, axe WCAG 2.2 AA (light and dark)
reference/            the original preview, for comparison
```

## Run locally

```bash
npm install
npm run dev            # http://localhost:5173
npm test               # unit tests
npm run test:e2e       # browser tests (Chromium)
npm run screenshots -- ./screenshots
```

`/api/lead` returns 501 locally. To try the live submit flow without a backend, run `MOCK_API=1 npm run dev` and set `formLive: true` in `config.js`. The stub accepts the request and throws it away; it stores and forwards nothing.

## Deploy

The site is plain static files. Upload `public/` to any static host (Cloudflare Pages, Netlify, S3 + CloudFront, Replit static).
- Cloudflare Pages: build command none, output directory `barakah-landing/public`.
- Serve it over HTTPS on the final subdomain, and route `/api/lead` to the Worker from handover Prompt 3 once it is approved.
- Turn on `formLive` and remove the `noindex` meta tag only after Compliance signs off.

## Submit contract (what the Worker must accept)

`POST /api/lead` as `multipart/form-data`:
- `payload`: JSON with `goal`, `programs[]`, `firstName`, `lastName`, `phone` (E.164 or null), `email` (or null), `state` (2-letter or `OTHER`), `language`, `waitlist`, `hasEstimate`, `noEstimateClicked`, `consent.email|callsTexts.{granted,text}`, `pageUrl` (path only), `utm`, `clientSubmittedAt`
- `website`: honeypot (should be empty)
- `estimate`: optional file (PDF/JPG/PNG/HEIC, 10 MB or less). It is never sent for `OTHER` state.

It must reply `{ "ok": true }`. The server must check everything again: it cannot trust the client. The server adds the IP, user agent and its own timestamp for the TCPA consent record.
