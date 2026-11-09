// Read leads from D1 with wrangler. Read-only except "mark".
//   npm run leads -- list [days]          recent leads (default 7 days)
//   npm run leads -- unsent               leads whose email alert failed
//   npm run leads -- export [file.csv]    every lead with both consent records, as CSV
//   npm run leads -- link <leadId>        a fresh signed Loan Estimate link (needs .dev.vars)
//   npm run leads -- mark <leadId> <status>  e.g. contacted, closed
// Add --local to read the local `wrangler dev` database instead of production.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHmac } from 'node:crypto';

const args = process.argv.slice(2).filter((a) => a !== '--local');
const where = process.argv.includes('--local') ? '--local' : '--remote';
const [cmd, a1, a2] = args;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function sql(command) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'barakah-leads', where, '--json', '--command', command], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit']
  });
  // wrangler may print notices (e.g. about proxies) before the JSON.
  const start = out.search(/^\s*\[/m);
  if (start < 0) throw new Error('Unexpected wrangler output');
  return JSON.parse(out.slice(start))[0]?.results ?? [];
}

function devVars() {
  const env = { ...process.env };
  if (existsSync('.dev.vars')) {
    for (const line of readFileSync('.dev.vars', 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2];
    }
  }
  return env;
}

/** Same signature as src/links.ts (HMAC-SHA256 over "key.exp", base64url). */
export function sign(objectKey, expSec, secret) {
  return createHmac('sha256', secret).update(`${objectKey}.${expSec}`).digest('base64url');
}

const csvCell = (v) => {
  const s = v == null ? '' : String(v);
  // Quote, and neutralize spreadsheet formulas.
  const safe = /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

function main() {
  if (cmd === 'list' || cmd === 'unsent') {
    const days = Math.max(1, Math.min(3650, Number(a1) || 7));
    const filter = cmd === 'unsent' ? 'alert_sent = 0' : `created_at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-${days} days')`;
    console.table(sql(`SELECT id, created_at, status, first_name, last_name, phone, email, state, goal, has_estimate, alert_sent FROM leads WHERE ${filter} ORDER BY created_at DESC`));
  } else if (cmd === 'export') {
    const rows = sql(`SELECT l.*, e.granted AS email_consent, e.recorded_at AS email_consent_at, e.ip, e.user_agent, e.consent_version,
      e.text_shown AS email_consent_text, c.granted AS calls_texts_consent, c.text_shown AS calls_texts_consent_text
      FROM leads l JOIN consents e ON e.lead_id = l.id AND e.channel = 'email'
      JOIN consents c ON c.lead_id = l.id AND c.channel = 'calls_texts' ORDER BY l.created_at`);
    const cols = rows.length ? Object.keys(rows[0]) : [];
    const file = a1 || `barakah-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    writeFileSync(file, [cols.map(csvCell).join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\n'));
    console.log(`Wrote ${rows.length} leads to ${file}. It contains personal data: store it securely and delete it when done.`);
  } else if (cmd === 'link') {
    if (!UUID.test(a1 || '')) throw new Error('Usage: link <leadId>');
    const [row] = sql(`SELECT estimate_key FROM leads WHERE id = '${a1}'`);
    if (!row?.estimate_key) return console.log('That lead has no uploaded Loan Estimate.');
    const { ESTIMATE_LINK_SECRET: secret, SITE_ORIGIN: origin } = devVars();
    if (!secret || !origin) throw new Error('Set ESTIMATE_LINK_SECRET and SITE_ORIGIN in .dev.vars');
    const exp = Math.floor(Date.now() / 1000) + 24 * 3600;
    console.log(`${origin}/api/estimate/${encodeURIComponent(row.estimate_key)}?exp=${exp}&sig=${sign(row.estimate_key, exp, secret)}`);
    console.log('Valid for 24 hours. Files are deleted after the retention period.');
  } else if (cmd === 'mark') {
    if (!UUID.test(a1 || '') || !/^[a-z-]{2,20}$/.test(a2 || '')) throw new Error('Usage: mark <leadId> <status>');
    sql(`UPDATE leads SET status = '${a2}' WHERE id = '${a1}'`);
    console.log(`Lead ${a1} marked ${a2}.`);
  } else {
    console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').slice(1, 8).join('\n'));
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) main();
