// Minimal GoHighLevel (LeadConnector API v2) client. Only the calls the lead endpoint needs.
export const GHL_BASE = 'https://services.leadconnectorhq.com';
export const GHL_VERSION = '2021-07-28';

export class GhlError extends Error {
  constructor(public step: string, public status: number) {
    super(`ghl ${step} ${status}`);
  }
}

export class Ghl {
  constructor(private token: string, private fetchImpl: typeof fetch = fetch) {}

  private async call<T>(step: string, method: string, path: string, body?: unknown): Promise<T> {
    const res = await this.fetchImpl(GHL_BASE + path, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Version: GHL_VERSION,
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new GhlError(step, res.status);
    return (await res.json().catch(() => ({}))) as T;
  }

  upsertContact(body: Record<string, unknown>) {
    return this.call<{ new?: boolean; contact?: { id?: string } }>('upsert', 'POST', '/contacts/upsert', body);
  }

  /** Adds tags without removing existing ones (upsert's `tags` would overwrite them). */
  addTags(contactId: string, tags: string[]) {
    return this.call('tags', 'POST', `/contacts/${encodeURIComponent(contactId)}/tags`, { tags });
  }

  createOpportunity(body: Record<string, unknown>) {
    return this.call<{ opportunity?: { id?: string } }>('opportunity', 'POST', '/opportunities/', body);
  }

  addNote(contactId: string, body: string) {
    return this.call('note', 'POST', `/contacts/${encodeURIComponent(contactId)}/notes`, { body });
  }
}
