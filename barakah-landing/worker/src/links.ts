// Signed, expiring links to a stored Loan Estimate. The bucket itself is never public.
const enc = new TextEncoder();

async function key(secret: string) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

const b64url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function fromB64url(s: string): Uint8Array | null {
  try {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(bin, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

export async function signLink(origin: string, objectKey: string, expSec: number, secret: string) {
  const sig = await crypto.subtle.sign('HMAC', await key(secret), enc.encode(`${objectKey}.${expSec}`));
  return `${origin}/api/estimate/${encodeURIComponent(objectKey)}?exp=${expSec}&sig=${b64url(sig)}`;
}

export async function verifyLink(objectKey: string, exp: string | null, sig: string | null, secret: string, nowSec: number) {
  if (!exp || !sig || !/^\d{1,12}$/.test(exp) || Number(exp) < nowSec) return false;
  const raw = fromB64url(sig);
  if (!raw) return false;
  return crypto.subtle.verify('HMAC', await key(secret), raw, enc.encode(`${objectKey}.${exp}`));
}
