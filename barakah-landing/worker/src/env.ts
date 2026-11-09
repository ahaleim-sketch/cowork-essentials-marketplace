export interface RateLimiter {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

/** Sends one plain-text email. Implemented with Cloudflare Email Routing in worker.ts; faked in tests. */
export type SendEmail = (msg: { from: string; to: string; subject: string; text: string }) => Promise<void>;

export interface Env {
  // Secret (wrangler secret put ESTIMATE_LINK_SECRET). Never in code or the client.
  ESTIMATE_LINK_SECRET: string;
  // Plain vars (wrangler.toml [vars]).
  ALLOWED_ORIGINS: string; // comma-separated, e.g. "https://second-look.example.com"
  ALERT_FROM: string; // sender on a domain with Cloudflare Email Routing enabled
  ALERT_TO: string; // advisor inbox; must be a verified Email Routing destination
  ESTIMATE_LINK_TTL_HOURS?: string; // default 72
  ESTIMATE_RETENTION_DAYS?: string; // default 30, must match the R2 lifecycle rule
  UPLOADS_ENABLED?: string; // "true" only after Compliance approves storage and privacy text
  // Bindings.
  DB: D1Database;
  ESTIMATES: R2Bucket;
  LEAD_LIMITER?: RateLimiter;
  ASSETS?: Fetcher;
}
