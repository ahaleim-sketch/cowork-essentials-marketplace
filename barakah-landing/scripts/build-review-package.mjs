// Builds an internal review package you can email or put on a shared drive:
//   dist/review/barakah-prelaunch-review.pdf   the review plus draft screenshots
//   dist/review/barakah-preview.html           the page as one offline file (double-click to open)
//   npm run review:package
// The preview is marked as an internal review copy. Its form never sends anything,
// whatever config.js says.
import { chromium } from 'playwright';
import { build } from 'esbuild';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const pub = root + 'public/';
const out = root + 'dist/review/';
mkdirSync(out, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const b64 = (path) => readFileSync(path).toString('base64');

/* ---------- 1. single-file offline preview ---------- */
async function buildPreview() {
  const bundle = await build({
    stdin: { contents: "import './app.js'; import './worksheet.js';", resolveDir: pub, loader: 'js' },
    bundle: true, format: 'iife', minify: true, write: false, target: 'es2020'
  });
  const js = bundle.outputFiles[0].text;
  // Force preview mode in the copy, whatever the live config says.
  const config = readFileSync(pub + 'config.js', 'utf8')
    .replace('window.BARAKAH_CONFIG = Object.freeze({', 'window.BARAKAH_CONFIG = Object.freeze({ formLive: false, sendEstimateFile: false,')
    .replace(/^\s*formLive: .*$/m, '').replace(/^\s*sendEstimateFile: .*$/m, '');

  let css = readFileSync(pub + 'styles.css', 'utf8');
  for (const f of readdirSync(pub + 'fonts')) css = css.replaceAll(`fonts/${f}`, `data:font/woff2;base64,${b64(pub + 'fonts/' + f)}`);
  css += `
.review-bar{position:sticky;top:0;z-index:50;background:#e0bd6a;color:#10281f;font:700 .8rem/1.4 var(--body);text-align:center;padding:8px max(16px,env(safe-area-inset-right,0px)) 8px max(16px,env(safe-area-inset-left,0px))}
.stub{border-top:1px solid var(--line);padding-block:30px}.stub h2{font-size:1.4rem}.stub p{color:var(--mute);margin-top:8px}`;

  let html = readFileSync(pub + 'index.html', 'utf8');
  html = html
    .replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`)
    .replace('<link rel="icon" href="img/favicon.svg" type="image/svg+xml">', `<link rel="icon" href="data:image/svg+xml;base64,${b64(pub + 'img/favicon.svg')}">`)
    .replace(/<link rel="preload"[^>]*>\n?/g, '')
    .replace('<script src="config.js"></script>', `<script>\n${config}\n</script>`)
    .replace('<script type="module" src="app.js"></script>', '')
    .replace('<script type="module" src="worksheet.js"></script>', '')
    .replace('<source srcset="img/hero.webp" type="image/webp">', `<source srcset="data:image/webp;base64,${b64(pub + 'img/hero.webp')}" type="image/webp">`)
    .replace('src="img/hero.jpg"', `src="data:image/jpeg;base64,${b64(pub + 'img/hero.jpg')}"`)
    .replaceAll('href="privacy.html"', 'href="#privacy-stub"')
    .replaceAll('href="terms.html"', 'href="#terms-stub"')
    .replace('<body>', `<body>\n<div class="review-bar" role="note">Internal review copy, ${today}. Not a live page: the form sends nothing. Not for publication.</div>`)
    .replace('</footer>', `</footer>
<section class="stub w" id="privacy-stub"><h2>Privacy Policy</h2><p>Placeholder. Everett Financial, Inc. D/B/A Supreme Lending (NMLS #2129) to supply before launch.</p></section>
<section class="stub w" id="terms-stub"><h2>Terms of Use and SMS Terms</h2><p>Placeholder. Everett Financial, Inc. D/B/A Supreme Lending (NMLS #2129) to supply before launch.</p></section>`)
    .replace('</body>', `<script>\n${js}\n</script>\n</body>`);
  if (/src="(?!data:)[^"]+\.(js|jpg|webp)"|href="(?!data:|#|https:)[^"]+\.css"/.test(html)) throw new Error('preview still references a local file');
  writeFileSync(out + 'barakah-preview.html', html);
  return out + 'barakah-preview.html';
}

/* ---------- 2. screenshots + PDF ---------- */
async function buildPdf(browser, port) {
  const shots = {};
  const shoot = async (name, width, scheme, fn) => {
    const p = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme, deviceScaleFactor: 2 });
    await p.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const buf = fn ? await fn(p) : await p.screenshot({ fullPage: true, type: 'jpeg', quality: 80 });
    shots[name] = 'data:image/jpeg;base64,' + buf.toString('base64');
    await p.close();
  };
  // Long pages are cut into page-sized slices so nothing is split mid-PDF-page awkwardly.
  const sliced = async (p, sliceCss) => {
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    const w = p.viewportSize().width;
    const parts = [];
    for (let y = 0; y < h; y += sliceCss) {
      parts.push((await p.screenshot({ clip: { x: 0, y, width: w, height: Math.min(sliceCss, h - y) }, type: 'jpeg', quality: 80, fullPage: true })).toString('base64'));
    }
    return parts;
  };
  const slices = {};
  for (const [name, width, scheme, sliceCss] of [['desktop', 1280, 'light', 1500], ['dark', 1280, 'dark', 1500], ['phone', 390, 'light', 1500]]) {
    const p = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme, deviceScaleFactor: 2 });
    await p.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    slices[name] = await sliced(p, sliceCss);
    await p.close();
  }
  await shoot('worksheet', 1280, 'light', async (p) => {
    await p.setInputFiles('#up2', { name: 'Loan-Estimate.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1') });
    for (const [id, v] of [['amt', '$400,000'], ['rate', '6.5'], ['apr', '6.731'], ['orig', '4,000'], ['pts', '2,000'], ['cc', '12,345']]) await p.fill('#' + id, v);
    return p.locator('.fo').screenshot({ type: 'jpeg', quality: 85 });
  });
  await shoot('errors', 1280, 'light', async (p) => {
    await p.click('#go');
    return p.locator('.sheet').screenshot({ type: 'jpeg', quality: 85 });
  });

  const img = (d, alt, cls = '') => `<img class="${cls}" src="${d.startsWith('data:') ? d : 'data:image/jpeg;base64,' + d}" alt="${alt}">`;
  let review = readFileSync(root + 'docs/review/review.html', 'utf8');
  // Replace the on-screen tab viewer with print-friendly figures.
  const draft = `
  <section aria-labelledby="h-draft" class="page-break">
    <h2 id="h-draft">Appendix: the draft page</h2>
    <p class="lead">Screenshots of the page as built on ${today}. The site is not live: the form sends nothing and the page is hidden from search engines. Rate-era phone, email and links still shown are items 3 and 4. Worksheet figures are examples.</p>
    <h3 class="fig-h">Desktop, light mode</h3>${slices.desktop.map((s) => img(s, 'Desktop page section', 'shot')).join('')}
    <h3 class="fig-h page-break">Phone, 390 px wide</h3><div class="phone-grid">${slices.phone.map((s) => img(s, 'Phone page section', 'shot')).join('')}</div>
    <h3 class="fig-h page-break">Desktop, dark mode</h3>${slices.dark.map((s) => img(s, 'Dark mode page section', 'shot')).join('')}
    <div class="pair page-break"><figure><h3 class="fig-h">Worksheet filled in</h3>${img(shots.worksheet, 'Worksheet with example figures', 'shot')}</figure>
    <figure><h3 class="fig-h">Form error messages</h3>${img(shots.errors, 'Form after empty submit', 'shot')}</figure></div>
  </section>`;
  // Decisions first; screenshots as an appendix at the end.
  review = review
    .replace(/<section aria-labelledby="h-draft">[\s\S]*?<\/section>\s*/, '')
    .replace(/<script>[\s\S]*?<\/script>/, '')
    .replace('</main>', draft + '\n</main>')
    .replace('<p class="lead">Ordered by severity.', '<p class="lead">Screenshots of the draft page are in the appendix at the end. Ordered by severity.');
  review = review.replace('<main class="w">', '<main class="w">').replace(
    '</style>',
    `.fig-h{font-size:1.05rem;margin:18px 0 8px}.shot{display:block;width:100%;border:1px solid var(--line);margin-bottom:6px;break-inside:avoid}
.phone-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}.pair figure{margin:0}
@media print{.page-break{break-before:page}.item,.passes article,.fixed div,tr{break-inside:avoid}.mast{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.tbl{overflow:visible}table{min-width:0}.note{break-inside:avoid}}
</style>`
  );
  review = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${review.replace('<meta name="claude:viewport-fit-sides" content="cover">', '')}`;
  review = review.replace('</title>', '</title>').replace(/<link rel="stylesheet" href="https:\/\/fonts[^>]*>/, `<style>${readFileSync(pub + 'styles.css', 'utf8').split('/* Design tokens')[0].replace(/url\(fonts\//g, `url(file://${pub}fonts/`)}</style>`);
  const tmp = out + '.review-print.html';
  writeFileSync(tmp, review + '</html>');
  const p = await browser.newPage();
  await p.emulateMedia({ colorScheme: 'light', media: 'print' });
  await p.goto('file://' + tmp, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({
    path: out + 'barakah-prelaunch-review.pdf', format: 'Letter', printBackground: true,
    margin: { top: '0.5in', bottom: '0.6in', left: '0.5in', right: '0.5in' },
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: `<div style="font:8px sans-serif;color:#51635a;width:100%;padding:0 0.5in;display:flex;justify-content:space-between"><span>Barakah pre-launch review, ${today}. Internal, not for publication.</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`
  });
  await p.close();
  rmSync(tmp, { force: true });
  return out + 'barakah-prelaunch-review.pdf';
}

const port = 5390;
const server = spawn(process.execPath, [root + 'scripts/serve.mjs'], { env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const browser = await chromium.launch();
try {
  console.log('Wrote', await buildPreview());
  console.log('Wrote', await buildPdf(browser, port));
} finally {
  await browser.close();
  server.kill();
}
