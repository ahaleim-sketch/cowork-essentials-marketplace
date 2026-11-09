// Shared Loan Estimate attachment state for the hero form (#up1) and the
// worksheet (#up2). The two dropzones always show the same file.
// The file's contents are never read in the browser.
import { checkUpload } from './form-validation.js';

const cfg = window.BARAKAH_CONFIG;
const PAIRS = [
  { input: 'up1', drop: 'd1', err: 'up1-err' },
  { input: 'up2', drop: 'd2', err: 'up2-err' }
];

let current = null;
const listeners = new Set();
const $ = (id) => document.getElementById(id);

export function getFile() {
  return current;
}

export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function setError(pair, message) {
  const err = $(pair.err);
  const drop = $(pair.drop);
  const input = $(pair.input);
  if (err) err.textContent = message || '';
  if (drop) drop.classList.toggle('bad', Boolean(message));
  if (input) {
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }
}

function render() {
  for (const pair of PAIRS) {
    const input = $(pair.input);
    $(pair.drop)?.classList.toggle('on', Boolean(current));
    if (!input) continue;
    if (!current) {
      input.value = '';
    } else if (!input.files || input.files[0] !== current) {
      try {
        const dt = new DataTransfer();
        dt.items.add(current);
        input.files = dt.files;
      } catch {
        /* Older browsers: state still holds the file; the input just shows nothing. */
      }
    }
  }
  document.querySelectorAll('[data-file-row]').forEach((row) => {
    row.hidden = !current;
    const name = row.querySelector('[data-file-name]');
    if (name) name.textContent = current ? 'Added: ' + current.name : '';
  });
  listeners.forEach((fn) => fn(current));
}

/** Attach a file coming from the given pair. Returns true when accepted. */
function attach(file, pair) {
  const error = checkUpload(file, cfg.upload);
  PAIRS.forEach((p) => setError(p, ''));
  if (error) {
    setError(pair, error);
    // Keep any previously accepted file, but reset the picker that failed.
    const input = $(pair.input);
    if (input && !current) input.value = '';
    else render();
    return false;
  }
  current = file;
  render();
  return true;
}

export function clearFile() {
  current = null;
  PAIRS.forEach((p) => setError(p, ''));
  render();
}

export function initAttachment() {
  for (const pair of PAIRS) {
    const input = $(pair.input);
    const drop = $(pair.drop);
    if (!input || !drop) continue;

    input.addEventListener('change', () => {
      const f = input.files && input.files[0];
      if (f && f !== current) attach(f, pair);
    });

    ['dragenter', 'dragover'].forEach((ev) =>
      drop.addEventListener(ev, (e) => {
        e.preventDefault();
        drop.classList.add('on');
      })
    );
    drop.addEventListener('dragleave', () => drop.classList.toggle('on', Boolean(current)));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) attach(f, pair);
      else drop.classList.toggle('on', Boolean(current));
    });
  }

  document.querySelectorAll('[data-file-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const inWorksheet = Boolean(btn.closest('#wsb'));
      clearFile();
      // Move focus to the picker that is still visible.
      const target = inWorksheet ? $('up2') : $('up1');
      target?.focus();
    });
  });

  render();
}
