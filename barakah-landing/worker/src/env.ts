export interface RateLimiter {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  // Secrets (wrangler secret put ...). Never in code or the client.
  GHL_TOKEN: string;
  GHL_LOCATION_ID: string;
  GHL_PIPELINE_ID: string;
  GHL_STAGE_ID: string;
  ESTIMATE_LINK_SECRET: string;
  // Custom field IDs, from `npm run ghl:check`.
  GHL_CF_LANGUAGE: string;
  GHL_CF_CONSENT_EMAIL: string;
  GHL_CF_CONSENT_CALLS: string;
  GHL_CF_ATTRIBUTION: string;
  // Plain vars (wrangler.toml [vars]).
  ALLOWED_ORIGINS: string; // comma-separated, e.g. "https://second-look.example.com"
  ESTIMATE_LINK_TTL_HOURS?: string; // default 72
  ESTIMATE_RETENTION_DAYS?: string; // default 30, must match the R2 lifecycle rule
  UPLOADS_ENABLED?: string; // "true" only after Compliance approves storage and privacy text
  // Bindings.
  ESTIMATES: R2Bucket;
  LEAD_LIMITER?: RateLimiter;
  ASSETS?: Fetcher;
}
