// Writes a lead and its two consent records to D1 in one batch (all or nothing).
import type { Lead, ConsentRecord } from './validate';
import { CONSENT_VERSION } from './consent';

export interface Evidence {
  at: string;
  ip: string;
  ua: string;
}

export async function saveLead(db: D1Database, id: string, lead: Lead, estimateKey: string | null, ev: Evidence) {
  const consentStmt = (channel: 'email' | 'calls_texts', c: ConsentRecord) =>
    db
      .prepare(
        `INSERT INTO consents (lead_id, channel, granted, recorded_at, page_url, ip, user_agent, consent_version, text_shown, text_matches_server)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(id, channel, c.granted ? 1 : 0, ev.at, lead.pageUrl, ev.ip, ev.ua, CONSENT_VERSION, c.textShown, c.textMatchesServer ? 1 : 0);

  await db.batch([
    db
      .prepare(
        `INSERT INTO leads (id, created_at, goal, programs, first_name, last_name, phone, email, state, language, waitlist,
                            has_estimate, estimate_key, estimate_attached_not_sent, no_estimate_clicked, page_url, utm)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id, ev.at, lead.goal, JSON.stringify(lead.programs), lead.firstName, lead.lastName, lead.phone, lead.email,
        lead.state, lead.language, lead.waitlist ? 1 : 0, estimateKey || lead.estimateAttachedNotSent ? 1 : 0,
        estimateKey, lead.estimateAttachedNotSent ? 1 : 0, lead.noEstimateClicked ? 1 : 0, lead.pageUrl, JSON.stringify(lead.utm)
      ),
    consentStmt('email', lead.consent.email),
    consentStmt('calls_texts', lead.consent.callsTexts)
  ]);
}

export async function markAlertSent(db: D1Database, id: string) {
  await db.prepare('UPDATE leads SET alert_sent = 1 WHERE id = ?').bind(id).run();
}
