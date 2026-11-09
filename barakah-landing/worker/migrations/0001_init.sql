-- Barakah leads. One row per submission. Keep consent rows as long as
-- Compliance requires (TCPA claims can be brought for 4 years).
CREATE TABLE leads (
  id                          TEXT PRIMARY KEY,          -- random UUID
  created_at                  TEXT NOT NULL,             -- ISO 8601, server time
  status                      TEXT NOT NULL DEFAULT 'new',
  goal                        TEXT NOT NULL CHECK (goal IN ('buy', 'refi')),
  programs                    TEXT NOT NULL,             -- JSON array
  first_name                  TEXT NOT NULL,
  last_name                   TEXT NOT NULL DEFAULT '',
  phone                       TEXT,                      -- E.164
  email                       TEXT,
  state                       TEXT NOT NULL,             -- 2-letter or OTHER
  language                    TEXT NOT NULL,
  waitlist                    INTEGER NOT NULL DEFAULT 0,
  has_estimate                INTEGER NOT NULL DEFAULT 0,
  estimate_key                TEXT,                      -- private R2 object key
  estimate_attached_not_sent  INTEGER NOT NULL DEFAULT 0,
  no_estimate_clicked         INTEGER NOT NULL DEFAULT 0,
  page_url                    TEXT NOT NULL DEFAULT '',
  utm                         TEXT NOT NULL DEFAULT '{}', -- JSON
  alert_sent                  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX leads_created_at ON leads (created_at);
CREATE INDEX leads_alert_sent ON leads (alert_sent);

-- TCPA / CAN-SPAM evidence: one row per consent box, checked or not.
CREATE TABLE consents (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id              TEXT NOT NULL REFERENCES leads (id),
  channel              TEXT NOT NULL CHECK (channel IN ('email', 'calls_texts')),
  granted              INTEGER NOT NULL,
  recorded_at          TEXT NOT NULL,
  page_url             TEXT NOT NULL,
  ip                   TEXT NOT NULL,
  user_agent           TEXT NOT NULL,
  consent_version      TEXT NOT NULL,
  text_shown           TEXT NOT NULL,
  text_matches_server  INTEGER NOT NULL
);
CREATE INDEX consents_lead ON consents (lead_id);
