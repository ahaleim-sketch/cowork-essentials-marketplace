export const pdf = (name = 'estimate.pdf', size = 2048) => ({ name, mimeType: 'application/pdf', buffer: Buffer.alloc(size, 37) });

/** Load the page with config overrides applied before app.js runs. */
export async function open(page, overrides = {}) {
  await page.addInitScript((o) => {
    let real;
    Object.defineProperty(window, 'BARAKAH_CONFIG', {
      configurable: true,
      get: () => real,
      set: (v) => { real = Object.freeze({ ...v, ...o }); }
    });
  }, overrides);
  await page.goto('/');
}

export async function fillValid(page) {
  await page.fill('#nm', 'Sam Doe');
  await page.fill('#ph', '(214) 555-0123');
  await page.selectOption('#st', 'TX');
}
