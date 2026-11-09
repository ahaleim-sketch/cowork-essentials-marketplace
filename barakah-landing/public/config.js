/*
 * Business values for the Barakah landing page.
 *
 * Every value marked TODO is UNCONFIRMED. These are carried over from the
 * Rate-era design preview (reference/barakah.html) and must be confirmed by
 * the business owner before launch. See docs/HANDOVER.md section 2,
 * "Open items that need the user's input". Do not invent replacement values.
 *
 * Loaded as a classic script before app.js so it can be edited without a build.
 */
window.BARAKAH_CONFIG = Object.freeze({
  // TODO(confirm): brand name under Everett / Supreme Lending (open item 4).
  brandName: 'Barakah Mortgage',
  brandTagline: 'ISLAMIC HOME FINANCING',

  // TODO(confirm): Rate-era phone number (open item 1).
  phoneDisplay: '1-833-786-7099',
  phoneE164: '+18337867099',

  // TODO(confirm): Rate-era email (open item 1).
  email: 'info@barakahmortgage.com',

  // TODO(confirm): Rate-era website (open item 1). Shown in the footer.
  websiteDisplay: 'www.barakahmortgage.com',
  websiteUrl: 'https://www.barakahmortgage.com',

  // TODO(confirm): physical address for the footer (open item 2).
  // Leave empty until confirmed; the footer omits it when empty.
  address: '',

  // TODO(confirm): scheduling link. The preview URL contains the advisor's
  // personal name in the path; the page rules say no personal name.
  calendarUrl: 'https://calendly.com/ahmedbadri/30min',

  // TODO(confirm): these point at a Bluehost staging host. Replace with the
  // final Barakah site URLs before launch (open item 1).
  links: {
    murabaha: 'https://kop.xib.mybluehost.me/website_a6ee0426/program-murabaha.html',
    partnership: 'https://kop.xib.mybluehost.me/website_a6ee0426/program-partnership.html',
    ijara: 'https://kop.xib.mybluehost.me/website_a6ee0426/program-arrive-eep.html',
    reviews: 'https://kop.xib.mybluehost.me/website_a6ee0426/fatwas.html',
    shariaBoard: 'https://kop.xib.mybluehost.me/website_a6ee0426/sharia-board.html'
  },

  // States where the advisor is licensed (handover Prompt 1).
  licensedStates: [
    ['CA', 'California'],
    ['FL', 'Florida'],
    ['MN', 'Minnesota'],
    ['OR', 'Oregon'],
    ['TX', 'Texas'],
    ['VA', 'Virginia'],
    ['WA', 'Washington']
  ],

  // Lead endpoint. Nothing is sent while formLive is false.
  // Keep false until Everett / Supreme Lending Compliance approves the page
  // and the /api/lead endpoint (handover Prompt 3) is deployed.
  formLive: false,
  leadEndpoint: '/api/lead',

  // Send the attached Loan Estimate to the server. Must match the Worker's
  // UPLOADS_ENABLED. Keep false until Compliance approves storage, retention
  // and the privacy text. While false, the worksheet still works (the file
  // is never read) and the lead is sent without the file.
  sendEstimateFile: false,
  // Must match the Worker's ESTIMATE_RETENTION_DAYS and the R2 lifecycle rule.
  estimateRetentionDays: 30,

  // Upload rules (client-side check only; the server must re-check).
  upload: {
    maxBytes: 10 * 1024 * 1024,
    extensions: ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif'],
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif']
  },

  // Spam guard: a submit sooner than this after page load is dropped.
  minMsOnPage: 3000
});
