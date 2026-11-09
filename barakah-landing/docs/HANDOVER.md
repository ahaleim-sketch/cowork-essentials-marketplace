# Handover: Barakah "Second Look" landing page + Loan Estimate worksheet
Prepared 2026-11-09 for Ahmed Badri. Use this in Claude Code to build the production version.

Reference build (design preview, v12): https://claude.ai/artifact/SYv7gqXkJPzE5bWHM3Ty2k
Reference file: `barakah.html` (single file, about 86 KB, photo embedded as base64). A copy with the image stripped, `barakah_noimg.html`, is easier to read.

---

## 1. What exists today

A single-page lead-generation landing page for Barakah Mortgage (Islamic home financing), now under **Everett Financial, Inc. D/B/A Supreme Lending, NMLS #2129**. Individual advisor NMLS #2753124.

It is a design preview only. The form sends nothing, the file upload is not read or stored, and nothing is connected to GoHighLevel (GHL).

**Page structure, top to bottom**
1. Green gradient hero.
   - Left: H1 "Your faith, your home, your values.", lede "Send us your current estimate. We show you the riba-free way.", three colored pills (Riba-free, Sharia board, Open to all), then a real-style photo (house, green lawn, SOLD sign, keys) feathered into the green with a CSS mask.
   - Right: a paper-style card "Talk to an advisor" holding the form.
2. Program cards with colored top borders, linking to the new Barakah site pages.
3. Six differentiator cards, plus links to the signed reviews and the Sharia board.
4. "Compare it yourself" worksheet, locked until a Loan Estimate is attached.
5. FAQ (4 items), contact band, footer with licensing and the Murabaha disclosure.

**Form fields (current)**
- Goal chips: Buy a home / Refinance (radio).
- Program chips (multi-select, "Not sure yet" is exclusive with the other three): Cost plus Profit (Murabaha), Diminishing Partnership (Musharakah), Home Earned Equity (Ijara).
- Full name, Phone, Email, State, Language (English / Arabic / Urdu / Other).
- Optional upload: "Attach your Loan Estimate" (PDF or image).
- Link: "No estimate yet? Let us show you what you qualify for." It focuses the name field.
- Two **unbundled** consent checkboxes: (a) marketing email, (b) calls and texts including autodialer or prerecorded voice, with STOP/HELP and "not a condition of purchase" language.
- Large gold CTA: "Talk to an advisor".

**Design tokens (already tokenized for light and dark)**
- Light: bg `#f7f4ec`, surface `#fffdf8`, fg `#14231c`, accent `#8a6a1c`, band `#0b4a36`, gold `#e0bd6a`.
- Dark: bg `#0e1a15`, surface `#15261f`, fg `#eef3ee`, accent `#d3ad5c`.
- Chip and CTA colors: sky `#bfe3f4`, sun `#ffd45e`, coral `#d6402f`, grass `#3f9a3f`, CTA gold `#f0b429` on `#12281f`. The CTA has a 6px "pressed" shadow `#b98312` and 1.3rem / 800 weight.
- Fonts: Newsreader (headings), Public Sans (body), both from Google Fonts.

---

## 2. Brand, copy and compliance rules (do not break these)

**Terminology**
- Use "financing", "profit rate", "monthly payment of cost plus profit". Never "loan", "interest" or "interest rate" in Barakah copy. Exception: the worksheet labels mirror a conventional Loan Estimate, so "Stated rate" and "APR" are allowed there because the borrower is reading a conventional document.
- The user asked for **no personal name and no word "lender"** on the page. "Equal Housing Lender" in the footer is a legally required statement and is kept as is.
- No Arabic text on the page (removed at the user's request).
- Program names exactly: **Cost plus Profit (Murabaha)**, **Diminishing Partnership (Musharakah)**, **Home Earned Equity (Ijara)**.

**Do not add (compliance)**
- No "costs less", "no extra cost", "easier to qualify" or "same approval odds" claims. The user asked for "proof" that Islamic financing does not cost more or is not harder to qualify for. That was **not built** because there is no substantiation. Under UDAAP and Reg Z advertising rules it would be a deceptive-claim risk. The page uses "Compare it yourself" and "ask for a side-by-side" instead. If Barakah or Everett produces documented data, a claim can be added with a footnote.
- No rates, payment amounts or down-payment figures on the page (Reg Z "triggering terms" would force full disclosures).
- Keep "open to all qualified applicants regardless of religion or national origin".
- Footer must keep: company name and NMLS #2129, advisor NMLS #2753124, Equal Housing statement, nmlsconsumeraccess.org, state licensing as required.
- "What you qualify for" wording is a risk. Safer: "see what you may qualify for". Everett compliance decides.

**Open items that need the user's input (do NOT guess in code)**
1. Phone (1-833-786-7099), email (info@barakahmortgage.com) and website (barakahmortgage.com) are Rate-era. Confirm the current ones.
2. Physical address for the footer (Rate's Chicago address was removed).
3. Everett / Supreme Lending Compliance approval of the consent text, the Murabaha disclosure paragraph, program names, and the "what you qualify for" line. This is a **blocker for going live**.
4. Whether the "Barakah" brand name continues under Everett.
5. Whether to add an "Imagery is AI-generated" note for the house photo.

---

## 3. The calculator (worksheet) spec

**Purpose.** Help a borrower read their current Loan Estimate as percentages and walk into a conversation with an advisor. It is **arithmetic only**. It is not a quote, does not grade the offer, and does not compare programs.

**Gate behavior.** The worksheet is hidden and empty until a Loan Estimate file is attached (via the hero form or the worksheet's own dropzone). Both dropzones stay in sync. The preview never uploads or parses the file; the borrower types the figures.

**Inputs (all optional numbers, strip `$ , %` characters)**
| Field | Loan Estimate source |
|---|---|
| Financing amount ($) | Loan Amount (page 1) |
| Stated rate (%) | Interest Rate (page 1) |
| APR (%) | Comparisons section, APR (page 3) |
| Origination charges ($) | Section A total (page 2) |
| Points paid ($) | Discount Points line in Section A (page 2) |
| Total closing costs ($) | Section J (page 2) |

**Outputs** (render only if amount > 0; otherwise show "Enter the figures from your estimate to see the arithmetic.")
- APR minus stated rate = `apr - rate` (shown as "x.xx pts")
- Origination % of amount = `orig / amount * 100`
- Points % of amount = `points / amount * 100`
- Closing costs % of amount = `closing / amount * 100`
- Three neutral questions to ask: Are origination charges fixed before closing? Which fees can I shop for, and which were chosen for me? What would this same file look like as riba-free financing?

**Required disclaimer under the tool:** "This does arithmetic on the figures you enter. It is not a quote, an offer or a comparison of programs."

**Reference implementation (from the preview)**
```js
function n(id){var v=parseFloat(String(document.getElementById(id).value).replace(/[^0-9.\-]/g,''));return isNaN(v)?0:v}
function pct(x){return x.toFixed(2)+'%'}
function run(){
  var a=n('amt'),r=n('rate'),apr=n('apr'),o=n('orig'),p=n('pts'),c=n('cc');
  if(a<=0){/* show empty-state message */return}
  // apr-r (pts), o/a*100, p/a*100, c/a*100 -> render four metrics + three questions
}
['amt','rate','apr','orig','pts','cc'].forEach(i=>el(i).addEventListener('input',run));
```

**Production upgrade (optional, phase 2): auto-read the Loan Estimate**
- Parse the PDF text layer (pdf.js) or OCR for images, pre-fill the six fields, and let the borrower correct them. Always show extracted values as editable.
- **Privacy:** a Loan Estimate is nonpublic personal information under GLBA. Process it server-side over TLS, encrypt at rest, set a retention limit, never send it to a third-party AI service without written approval from Everett's compliance and a vendor agreement, and state what happens to the file in the form. Offer "calculate without uploading" only if Everett approves removing the upload gate.

---

## 4. Production build plan

**Recommended stack:** a single static page (HTML + CSS + vanilla JS, no framework) for speed and easy hosting, plus one serverless endpoint (Cloudflare Worker or similar) that receives the form and creates/updates the contact in GHL. The user already has Cloudflare Workers experience (My Brain app). Hosting on Replit is also possible.

**GHL wiring (to do)**
- Use a GHL private integration token stored as a server secret. Never put it in the page.
- Endpoint creates or upserts a contact with: name, phone, email, state, language, tags `barakah-lp`, `goal:buy|refi`, `program:<each>`, `has-estimate:yes|no`.
- Store both consents as separate custom fields with timestamp, page URL, IP and the exact consent text shown (TCPA evidence). Only set DND/consent flags per the boxes checked.
- "No estimate" flag becomes the tag `needs-qualification-review`.
- Add the opportunity to the Barakah pipeline and trigger the instant-response workflow once the sender domain is confirmed.
- Honeypot field + basic rate limit for spam.

**Hosting / tracking:** custom subdomain, Meta Pixel and Conversions API (lead event only, no estimate figures sent), UTM capture into hidden GHL fields. Do not put names, phone or amounts in URLs.

---

## 5. Prompts for Claude Code

Paste them in order. Each is self-contained. Put the reference file `barakah.html` in the project folder first.

### Prompt 0: project setup
```
You are a senior front-end engineer and mortgage-marketing compliance-aware developer.

Context: I am handing you a design-preview landing page (barakah.html) for Barakah Mortgage, an Islamic home financing brand now operated by Everett Financial, Inc. D/B/A Supreme Lending (NMLS #2129). Read barakah.html fully before doing anything. Also read CLAUDE_CODE_HANDOVER_barakah-landing-and-calculator.md in this folder: it is the source of truth for copy rules, compliance constraints, and open items.

Task: initialize a clean project that turns the preview into a production static site.
- Create /public/index.html, /public/styles.css, /public/app.js, and /public/img/ (extract the base64 hero photo into a real optimized WebP and JPG with width/height attributes and a descriptive alt).
- Preserve the design exactly: tokens, light/dark theming via CSS custom properties, chip styles, the large gold CTA, the feathered photo mask.
- Do not change any user-facing wording. Do not add any claim about cost, approval odds or savings. Never use the words "loan" or "interest rate" in Barakah copy outside the worksheet labels. Do not add Arabic text or the advisor's personal name.
- Put every unconfirmed business value (phone, email, website, address, brand name) in a single config.js with TODO markers, and read them from there. Do not invent values.
- Add a README with how to run locally and deploy.

Before writing code, give me a short plan (files, decisions, risks). Then implement, run it locally, and verify at 390px and 1280px widths in light and dark mode with screenshots. Report anything that differs from barakah.html.
```

### Prompt 1: the form, validation and accessibility
```
Harden the lead form in /public so it is production-ready, without changing its look or copy.

Requirements:
1. Fields: goal (buy/refi radios), programs (3 checkboxes + exclusive "Not sure yet"), full name, phone, email, state, language, optional Loan Estimate file, and two separate unchecked consent checkboxes (marketing email; calls/texts). Consent boxes must never be pre-checked or bundled, and must not be required to submit.
2. Validation: name required; at least phone or email; phone normalized to E.164 (US); email format; state as a 2-letter select limited to the states where the advisor is licensed: CA, FL, MN, OR, TX, VA, WA (keep a "Other state" option that routes to a waitlist message without collecting a file). Inline, specific error messages; focus moves to the first error.
3. Accessibility: WCAG 2.2 AA. Real <label>s, fieldset/legend for chip groups, visible keyboard focus, 44px minimum targets, aria-live status for submit results, reduced-motion respected, color contrast verified in both themes.
4. Upload: accept PDF/JPG/PNG/HEIC up to 10 MB, client-side type and size check, clear remove button, drag-and-drop with a keyboard-accessible fallback. Do not read file contents in the browser.
5. Submit: POST JSON (and the file as multipart) to /api/lead. Disable the button while sending, show success ("Thank you. An advisor will contact you.") and a failure state with the phone number from config.js.
6. Spam: hidden honeypot field and a minimum-time-on-page check.

Do not store anything in localStorage. Write tests for validation (Vitest or Playwright) and run them. Show me the results.
```

### Prompt 2: the calculator
```
Build the "Compare it yourself" worksheet as a self-contained module (worksheet.js + styles) and wire it into index.html.

Behavior:
- Locked state: the section shows only a dropzone ("Upload your Loan Estimate"). All six fields are empty and hidden until a file is attached via either the hero form's upload or this dropzone; the two stay in sync and show the file name.
- Unlocked: six inputs: Financing amount ($), Stated rate (%), APR (%), Origination charges ($), Points paid ($), Total closing costs ($). Strip $ , % and spaces; ignore non-numeric input; never produce NaN or Infinity.
- Outputs (only when amount > 0): APR minus stated rate in percentage points; origination, points and closing costs each as a percent of the financing amount, to two decimals. Then show exactly three neutral questions to ask the advisor.
- Always show: "This does arithmetic on the figures you enter. It is not a quote, an offer or a comparison of programs."
- Do NOT add any judgement such as "high", "low", "good" or "bad", any benchmark, any savings estimate, or any comparison with Islamic financing numbers. The tool does arithmetic only.

Engineering:
- Pure functions in a separate file (computeMetrics(inputs) -> {...}) with unit tests: zero amount, blank fields, commas and dollar signs, very large amounts, APR below rate, decimal rounding.
- Output container is aria-live="polite"; labels tied to inputs; inputmode="decimal".
- Add a "Start over" button that clears the fields and re-locks nothing (file stays attached).

Run the tests and show me results plus a screenshot of the locked and unlocked states at 390px and 1280px.
```

### Prompt 3: GoHighLevel integration
```
Create a serverless endpoint (Cloudflare Worker, TypeScript) at POST /api/lead that receives the form and writes to GoHighLevel.

Rules:
- Secrets only from environment bindings (GHL_TOKEN, GHL_LOCATION_ID, GHL_PIPELINE_ID, GHL_STAGE_ID). Never in code or the client. Provide a .dev.vars.example.
- Validate and sanitize input server-side (the client is untrusted). Reject unknown fields. Enforce file type/size. Apply rate limiting per IP.
- Upsert the contact by phone/email. Set: firstName, lastName, phone (E.164), email, state, language preference; tags: barakah-lp, goal:<buy|refi>, program:<name> for each selected, has-estimate:<yes|no>, and needs-qualification-review when no file is attached.
- Consent: write each consent as its own custom field with ISO timestamp, page URL, IP, user agent, and the exact consent text shown at the time. Only mark email/SMS permission for boxes actually checked.
- Create an opportunity in the Barakah pipeline.
- Store an uploaded Loan Estimate in private storage (e.g., R2) with a random object key, encrypted at rest, a retention period set by config, and attach only a signed, expiring link to the GHL note. Never make the file publicly readable and never send its contents to any AI or third-party service.
- Return JSON {ok:true} or a safe error without leaking internals. Log without PII.

First call the GHL API with a read-only request to confirm the token, location and custom-field IDs; create missing custom fields through the API and tell me which ones you created. Add integration tests with a mocked GHL. Do not run anything that sends messages to real contacts.
```

### Prompt 4: compliance and quality review (run before launch)
```
Act as an independent reviewer with mortgage-advertising compliance experience and a front-end QA lead. Review the built site end to end and produce a pass/fail checklist with file/line references and exact fixes.

Check:
1. Advertising: no rates, payments or down-payment amounts (Reg Z triggering terms); no cost, savings, speed or approval-odds claims; no "guarantee"; no personal name; no "loan"/"interest" in Barakah copy (worksheet labels excepted); "open to all qualified applicants regardless of religion or national origin" present.
2. Required disclosures: company name and NMLS #2129, advisor NMLS #2753124, Equal Housing statement, nmlsconsumeraccess.org, Murabaha disclosure paragraph, "not a quote" note on the worksheet. Flag anything pending Everett Compliance approval.
3. Consent: two unbundled, unchecked, not-required boxes; text names the correct entity; STOP/HELP and frequency language present; evidence is captured server-side.
4. Privacy: privacy policy and terms links exist and work (create stubs marked TODO if missing); upload handling matches the stated policy; no PII in URLs, logs or analytics events.
5. Technical: Lighthouse performance/accessibility/SEO scores, no console errors, works at 360-1440px, light and dark, keyboard-only, screen-reader labels, reduced motion.
6. Content integrity: every external link resolves; program links go to the correct Barakah site pages; no placeholder text left.

Output: a table of findings sorted by severity, then fix the ones that are code-only and list those that need a business decision from me.
```

### Prompt 5 (optional): SureChoice version
```
Create a second page from the same codebase for SureChoice Lending LLC (Plano, TX; company NMLS #2615863, loan officer NMLS #2395248; phone (469) 334-4877). It is the conventional version: navy and gold theme, headline about getting a second look at your Loan Estimate, same worksheet module and same form behavior, "Se habla español" line kept. Reuse the components; only the theme tokens, copy, licensing footer and GHL tags (surechoice-lp) change. Apply the same advertising and consent rules. Use the worksheet question wording "Which fees can I shop for, and which were chosen for me?" consistently. Flag Texas licensing text I must confirm.
```

---

## 6. Suggested order of work
1. Answer the open items in section 2 (contacts, address, brand, compliance owner).
2. Prompt 0, then 1, then 2 (visible, no backend needed).
3. Send the built page to Everett/Supreme Compliance for approval **before** Prompt 3 goes live.
4. Prompt 3 (GHL), then Prompt 4 (review), then launch.
5. Prompt 5 only if SureChoice still wants it.

## 7. Known risks
- The preview's house photo is AI-generated; decide on disclosure.
- Uploaded Loan Estimates are sensitive; do not enable file upload in production until storage, retention and privacy text are approved.
- Rate-era contact details and the disclosure paragraph may be outdated.
- Do not publish ads that point to this page until compliance has signed off.
