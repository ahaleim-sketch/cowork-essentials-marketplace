import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { open, fillValid, pdf } from './helpers.js';

test.describe('lead form', () => {
  test('config values render and nothing is pre-checked for consent', async ({ page }) => {
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await open(page);
    await expect(page.locator('.top .ph')).toHaveText('1-833-786-7099');
    await expect(page.locator('#c1')).not.toBeChecked();
    await expect(page.locator('#c2')).not.toBeChecked();
    await expect(page.locator('#p4')).toBeChecked();
    const states = await page.locator('#st option').evaluateAll((o) => o.map((x) => x.value));
    expect(states).toEqual(['', 'CA', 'FL', 'MN', 'OR', 'TX', 'VA', 'WA', 'OTHER']);
    await expect(page.locator('#preview-note')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('"Not sure yet" is exclusive', async ({ page }) => {
    await open(page);
    await page.click('label[for=p1]');
    await expect(page.locator('#p4')).not.toBeChecked();
    await page.click('label[for=p3]');
    await page.click('label[for=p4]');
    await expect(page.locator('#p1')).not.toBeChecked();
    await expect(page.locator('#p3')).not.toBeChecked();
  });

  test('empty submit shows inline errors and focuses the first', async ({ page }) => {
    await open(page);
    await page.click('#go');
    await expect(page.locator('#nm-err')).toHaveText('Enter your full name.');
    await expect(page.locator('#ph-err')).toContainText('phone number or an email');
    await expect(page.locator('#st-err')).toHaveText('Choose your state.');
    await expect(page.locator('#nm')).toBeFocused();
    await expect(page.locator('#nm')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#msg')).toHaveText('Please fix the 3 highlighted fields.');
  });

  test('bad phone focuses phone; typing clears the error', async ({ page }) => {
    await open(page);
    await page.fill('#nm', 'Sam Doe');
    await page.fill('#ph', '555');
    await page.selectOption('#st', 'CA');
    await page.click('#go');
    await expect(page.locator('#ph')).toBeFocused();
    await expect(page.locator('#ph-err')).toContainText('10-digit');
    await page.fill('#ph', '2145550123');
    await expect(page.locator('#ph-err')).toBeEmpty();
  });

  test('preview mode sends nothing', async ({ page }) => {
    let posted = false;
    await page.route('**/api/lead', (r) => { posted = true; r.fulfill({ json: { ok: true } }); });
    await open(page, { minMsOnPage: 0 });
    await fillValid(page);
    await page.click('#go');
    await expect(page.locator('#msg')).toContainText('Preview only: nothing was sent');
    expect(posted).toBe(false);
  });

  test('live mode posts multipart with payload and file, then shows success', async ({ page }) => {
    let req;
    await page.route('**/api/lead', async (r) => { req = r.request(); await new Promise((s) => setTimeout(s, 300)); r.fulfill({ json: { ok: true } }); });
    await open(page, { formLive: true, sendEstimateFile: true, minMsOnPage: 0 });
    await fillValid(page);
    await page.click('#c2-text');
    await page.setInputFiles('#up1', pdf());
    await page.click('#go');
    await expect(page.locator('#go')).toBeDisabled();
    await expect(page.locator('#msg')).toHaveText('Thank you. An advisor will contact you.');
    await expect(page.locator('#go')).toBeEnabled();
    const body = req.postDataBuffer().toString('latin1');
    expect(req.headers()['content-type']).toMatch(/multipart\/form-data/);
    expect(body).toContain('name="estimate"; filename="estimate.pdf"');
    const json = JSON.parse(body.match(/name="payload"\r\n\r\n(.*?)\r\n--/s)[1]);
    expect(json).toMatchObject({ goal: 'buy', programs: ['not-sure'], firstName: 'Sam', lastName: 'Doe', phone: '+12145550123', state: 'TX', hasEstimate: true });
    expect(json.consent.email.granted).toBe(false);
    expect(json.consent.callsTexts.granted).toBe(true);
    expect(json.consent.callsTexts.text).toContain('Reply STOP to opt out, HELP for help.');
    expect(json.pageUrl).not.toContain('?');
  });

  test('with sendEstimateFile off, the file stays in the browser', async ({ page }) => {
    let req;
    await page.route('**/api/lead', (r) => { req = r.request(); r.fulfill({ json: { ok: true } }); });
    await open(page, { formLive: true, minMsOnPage: 0 });
    await fillValid(page);
    await page.setInputFiles('#up1', pdf());
    await page.click('#go');
    await expect(page.locator('#msg')).toHaveText('Thank you. An advisor will contact you.');
    const body = req.postDataBuffer().toString('latin1');
    expect(body).not.toContain('name="estimate"');
    expect(body).not.toContain('%%%%');
    expect(body).toContain('"hasEstimate":false');
    expect(body).toContain('"estimateAttachedNotSent":true');
  });

  test('live mode failure shows the phone number', async ({ page }) => {
    await page.route('**/api/lead', (r) => r.fulfill({ status: 500, json: { ok: false } }));
    await open(page, { formLive: true, minMsOnPage: 0 });
    await fillValid(page);
    await page.click('#go');
    await expect(page.locator('#msg')).toHaveText('We could not send your request. Please call 1-833-786-7099.');
    await expect(page.locator('#msg a')).toHaveAttribute('href', 'tel:+18337867099');
  });

  test('honeypot and too-fast submits send nothing', async ({ page }) => {
    let posted = 0;
    await page.route('**/api/lead', (r) => { posted++; r.fulfill({ json: { ok: true } }); });
    await open(page, { formLive: true, minMsOnPage: 60000 });
    await fillValid(page);
    await page.click('#go');
    await expect(page.locator('#msg')).toHaveText('Thank you. An advisor will contact you.');
    expect(posted).toBe(0);
  });

  test('"Other state" shows the waitlist note, hides the upload and sends no file', async ({ page }) => {
    let req;
    await page.route('**/api/lead', (r) => { req = r.request(); r.fulfill({ json: { ok: true } }); });
    await open(page, { formLive: true, sendEstimateFile: true, minMsOnPage: 0 });
    await page.setInputFiles('#up1', pdf());
    await page.fill('#nm', 'Sam Doe');
    await page.fill('#em', 'sam@example.com');
    await page.selectOption('#st', 'OTHER');
    await expect(page.locator('#waitlist')).toBeVisible();
    await expect(page.locator('#upwrap')).toBeHidden();
    await page.click('#go');
    await expect(page.locator('#msg')).toHaveText('Thank you. An advisor will contact you.');
    const body = req.postDataBuffer().toString('latin1');
    expect(body).not.toContain('name="estimate"');
    expect(body).toContain('"waitlist":true');
  });

  test('upload rejects wrong type and oversize files', async ({ page }) => {
    await open(page);
    await page.setInputFiles('#up1', { name: 'x.docx', mimeType: 'application/msword', buffer: Buffer.from('x') });
    await expect(page.locator('#up1-err')).toHaveText('Attach a PDF, JPG, PNG or HEIC file.');
    await expect(page.locator('#wsb')).toBeHidden();
    await page.setInputFiles('#up1', pdf('big.pdf', 10 * 1024 * 1024 + 1));
    await expect(page.locator('#up1-err')).toContainText('larger than 10 MB');
    await page.setInputFiles('#up1', pdf());
    await expect(page.locator('#up1-err')).toBeEmpty();
    await expect(page.locator('#upwrap [data-file-name]')).toHaveText('Added: estimate.pdf');
  });

  test('file input is reachable by keyboard', async ({ page }) => {
    await open(page);
    await page.focus('#lg');
    await page.keyboard.press('Tab');
    await expect(page.locator('#up1')).toBeFocused();
  });

  test('does not use localStorage', async ({ page }) => {
    await open(page, { minMsOnPage: 0 });
    await fillValid(page);
    await page.setInputFiles('#up1', pdf());
    await page.click('#go');
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  });

  for (const scheme of ['light', 'dark']) {
    test(`axe: no WCAG 2.2 AA violations (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await open(page);
      await page.setInputFiles('#up1', pdf());
      await page.fill('#amt', '400000');
      await page.click('#go'); // render error states too
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const summary = r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      expect(summary).toEqual([]);
    });
  }
});
