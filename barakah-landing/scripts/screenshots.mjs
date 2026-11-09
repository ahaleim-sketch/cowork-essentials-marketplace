// Captures the build (and the reference preview) at 390px and 1280px, light and dark.
//   node scripts/screenshots.mjs [outDir]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const out = process.argv[2] || 'screenshots';
mkdirSync(out, { recursive: true });
const port = 5288;
const server = spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));
const refUrl = 'file://' + fileURLToPath(new URL('../reference/barakah.html', import.meta.url));
const pdf = { name: 'Loan-Estimate.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(2048, 37) };

const browser = await chromium.launch();
try {
  for (const width of [390, 1280]) {
    for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const tag = `${width}-${scheme}`;

      await page.goto(refUrl, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `${out}/ref-${tag}.png`, fullPage: true });

      await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `${out}/build-${tag}.png`, fullPage: true });
      const ws = page.locator('.fo');
      await ws.screenshot({ path: `${out}/worksheet-locked-${tag}.png` });
      await page.setInputFiles('#up2', pdf);
      for (const [id, v] of [['amt', '$400,000'], ['rate', '6.5'], ['apr', '6.731'], ['orig', '4,000'], ['pts', '2,000'], ['cc', '12,345']]) await page.fill('#' + id, v);
      await ws.screenshot({ path: `${out}/worksheet-unlocked-${tag}.png` });
      await page.click('#go');
      await page.locator('.sheet').screenshot({ path: `${out}/form-errors-${tag}.png` });
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  server.kill();
}
console.log('Saved to', out);
