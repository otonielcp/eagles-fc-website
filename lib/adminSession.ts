/**
 * Signed admin session tokens.
 *
 * The previous scheme stored the literal string "authenticated" in the
 * admin_auth cookie, so anyone could grant themselves full admin access with
 * `Cookie: admin_auth=authenticated` — and the admin portal shows minors' names,
 * birthdates and ages. httpOnly does not help here: it stops scripts from
 * READING the cookie, not an attacker from SETTING one.
 *
 * Tokens are `admin.<expiry>.<hmac>`, signed with a server-only secret. The
 * secret defaults to ADMIN_PASSWORD so no new deploy configuration is needed;
 * set ADMIN_SESSION_SECRET to rotate sessions independently of the password.
 *
 * Uses Web Crypto (not node:crypto) because middleware runs on the Edge runtime.
 */

const SCOPE = 'admin';
const DEFAULT_TTL_MS = 60 * 60 * 24 * 7; // matches the old 7-day cookie
const encoder = new TextEncoder();

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  // btoa is available on both the Edge and Node runtimes; Buffer is not.
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

/** Constant-time compare so a wrong signature leaks nothing through timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const ADMIN_COOKIE_NAME = 'admin_auth';
export const ADMIN_SESSION_TTL_SECONDS = DEFAULT_TTL_MS;

export async function createSessionToken(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) {
    console.error('[adminSession] ADMIN_PASSWORD/ADMIN_SESSION_SECRET is not set; refusing to issue a session');
    return null;
  }
  const expiresAt = Date.now() + DEFAULT_TTL_MS * 1000;
  const payload = `${SCOPE}.${expiresAt}`;
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  const secret = getSecret();
  if (!secret) {
    // Fail closed: no secret means we cannot prove anything, so trust nothing.
    console.error('[adminSession] ADMIN_PASSWORD/ADMIN_SESSION_SECRET is not set; denying admin access');
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [scope, expiresAtRaw, signature] = parts;
  if (scope !== SCOPE) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return safeEqual(signature, await sign(`${scope}.${expiresAtRaw}`, secret));
}
