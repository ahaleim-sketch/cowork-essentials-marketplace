import { test, expect } from '@playwright/test';
import { open, pdf } from './helpers.js';

test.describe('worksheet', () => {
  test('locked until a file is attached; disclaimer always visible', async ({ page }) => {
    await open(page);
    await expect(page.locator('#gate')).toBeVisible();
    await expect(page.locator('#wsb')).toBeHidden();
    await expect(page.getByText('This does arithmetic on the figures you enter. It is not a quote, an offer or a comparison of programs.')).toBeVisible();
  });

  test('hero upload unlocks it and both dropzones show the file', async ({ page }) => {
    await open(page);
    await page.setInputFiles('#up1', pdf('LE.pdf'));
    await expect(page.locator('#wsb')).toBeVisible();
    await expect(page.locator('#gate')).toBeHidden();
    await expect(page.locator('#wsb [data-file-name]')).toHaveText('Added: LE.pdf');
    await expect(page.locator('#upwrap [data-file-name]')).toHaveText('Added: LE.pdf');
    await expect(page.locator('#out')).toHaveText('Enter the figures from your estimate to see the arithmetic.');
    for (const id of ['amt', 'rate', 'apr', 'orig', 'pts', 'cc']) await expect(page.locator('#' + id)).toHaveValue('');
  });

  test('worksheet upload syncs back to the hero form', async ({ page }) => {
    await open(page);
    await page.setInputFiles('#up2', pdf('mine.pdf'));
    await expect(page.locator('#upwrap [data-file-name]')).toHaveText('Added: mine.pdf');
    expect(await page.locator('#up1').evaluate((i) => i.files[0]?.name)).toBe('mine.pdf');
  });

  test('computes arithmetic and shows exactly three questions', async ({ page }) => {
    await open(page);
    await page.setInputFiles('#up2', pdf());
    await page.fill('#amt', '$400,000');
    await page.fill('#rate', '6.5%');
    await page.fill('#apr', '6.731');
    await page.fill('#orig', '4,000');
    await page.fill('#pts', '$2,000');
    await page.fill('#cc', '12345');
    const rows = await page.locator('#out .m').allInnerTexts();
    expect(rows.map((r) => r.replace(/\s+/g, ' '))).toEqual([
      'APR minus stated rate 0.23 pts',
      'Origination charges as % of amount 1.00%',
      'Points as % of amount 0.50%',
      'Closing costs as % of amount 3.09%'
    ]);
    await expect(page.locator('#out .qs li')).toHaveCount(3);
    const text = (await page.locator('#out').innerText()).toLowerCase();
    for (const w of ['high', 'low', 'good', 'bad', 'save', 'cheaper']) expect(text).not.toMatch(new RegExp('\\b' + w + '\\b'));
  });

  test('garbage input never shows NaN or Infinity', async ({ page }) => {
    await open(page);
    await page.setInputFiles('#up2', pdf());
    await page.fill('#amt', '0.0000001');
    await page.fill('#orig', 'abc');
    await page.fill('#cc', '9'.repeat(400));
    const t = await page.locator('#out').innerText();
    expect(t).not.toMatch(/NaN|Infinity/);
  });

  test('Start over clears fields but keeps the file', async ({ page }) => {
    await open(page);
    await page.setInputFiles('#up2', pdf());
    await page.fill('#amt', '100000');
    await page.click('#ws-reset');
    await expect(page.locator('#amt')).toHaveValue('');
    await expect(page.locator('#amt')).toBeFocused();
    await expect(page.locator('#wsb')).toBeVisible();
    await expect(page.locator('#out')).toHaveText('Enter the figures from your estimate to see the arithmetic.');
  });

  test('Remove re-locks the worksheet and clears its fields', async ({ page }) => {
    await open(page);
    await page.setInputFiles('#up1', pdf());
    await page.fill('#amt', '100000');
    await page.locator('#wsb [data-file-remove]').click();
    await expect(page.locator('#gate')).toBeVisible();
    await expect(page.locator('#wsb')).toBeHidden();
    await expect(page.locator('#upwrap [data-file-row]')).toBeHidden();
    await expect(page.locator('#up2')).toBeFocused();
    await page.setInputFiles('#up1', pdf());
    await expect(page.locator('#amt')).toHaveValue('');
  });
});
