// Checks the GHL token, location, pipeline and custom fields. Read-only by default.
//   npm run ghl:check           -> read-only report
//   npm run ghl:create-fields   -> also creates any missing Barakah custom fields
// Reads GHL_TOKEN and GHL_LOCATION_ID from the environment or .dev.vars. Sends no messages.
import { readFileSync, existsSync } from 'node:fs';

const env = { ...process.env };
if (existsSync('.dev.vars')) {
  for (const line of readFileSync('.dev.vars', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !env[m[1]]) env[m[1]] = m[2];
  }
}
const { GHL_TOKEN, GHL_LOCATION_ID } = env;
if (!GHL_TOKEN || !GHL_LOCATION_ID) {
  console.error('Set GHL_TOKEN and GHL_LOCATION_ID (in .dev.vars or the environment).');
  process.exit(1);
}
const create = process.argv.includes('--create');
const BASE = 'https://services.leadconnectorhq.com';
const H = { Authorization: `Bearer ${GHL_TOKEN}`, Version: '2021-07-28', Accept: 'application/json' };

async function get(path) {
  const r = await fetch(BASE + path, { headers: H });
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status}`);
  return r.json();
}

const WANTED = [
  { env: 'GHL_CF_LANGUAGE', name: 'Barakah Language', dataType: 'TEXT' },
  { env: 'GHL_CF_CONSENT_EMAIL', name: 'Barakah Consent Email', dataType: 'LARGE_TEXT' },
  { env: 'GHL_CF_CONSENT_CALLS', name: 'Barakah Consent Calls Texts', dataType: 'LARGE_TEXT' },
  { env: 'GHL_CF_ATTRIBUTION', name: 'Barakah Attribution', dataType: 'LARGE_TEXT' }
];

const loc = await get(`/locations/${GHL_LOCATION_ID}`);
console.log(`Token OK. Location: ${loc.location?.name ?? '(name hidden)'} (${GHL_LOCATION_ID})`);

const { pipelines = [] } = await get(`/opportunities/pipelines?locationId=${GHL_LOCATION_ID}`);
console.log('\nPipelines (set GHL_PIPELINE_ID and GHL_STAGE_ID):');
for (const p of pipelines) {
  console.log(`  ${p.name}  ${p.id}`);
  for (const s of p.stages ?? []) console.log(`      stage: ${s.name}  ${s.id}`);
}

const { customFields = [] } = await get(`/locations/${GHL_LOCATION_ID}/customFields?model=contact`);
console.log('\nCustom fields:');
const created = [];
for (const w of WANTED) {
  let f = customFields.find((c) => c.name === w.name);
  if (!f && create) {
    const r = await fetch(`${BASE}/locations/${GHL_LOCATION_ID}/customFields`, {
      method: 'POST',
      headers: { ...H, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: w.name, dataType: w.dataType, model: 'contact' })
    });
    if (!r.ok) throw new Error(`create ${w.name} -> ${r.status}`);
    f = (await r.json()).customField;
    created.push(w.name);
  }
  console.log(`  ${w.env}=${f ? f.id : '(missing: run npm run ghl:create-fields)'}   # ${w.name}${f?.fieldKey ? ' / ' + f.fieldKey : ''}`);
}
if (created.length) console.log(`\nCreated: ${created.join(', ')}`);
