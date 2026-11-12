// Server-side check for Cloudflare Turnstile ("are you human") tokens.
//
// Every public form sends the token its Turnstile widget produced, and the
// server action calls verifyTurnstile() before saving or emailing anything.
// Bots that post straight to the action endpoint have no valid token, so they
// are rejected even though they never load the page.
//
// Setup (Cloudflare dashboard → Turnstile → Add widget, domain eaglesfcgi.org):
//   NEXT_PUBLIC_TURNSTILE_SITE_KEY  – public site key, used by the widget
//   TURNSTILE_SECRET_KEY            – secret key, used only here
// Set both together. Until TURNSTILE_SECRET_KEY is set the check is skipped
// (with a warning) so the forms keep working.
import { headers } from 'next/headers';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export { HUMAN_CHECK_FAILED_MESSAGE } from '@/lib/humanCheck';

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY is not set; skipping the human check.');
    return true;
  }

  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return false;
  }

  const body = new URLSearchParams({ secret, response: token });
  const h = await headers();
  const ip = h.get('cf-connecting-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (ip) body.set('remoteip', ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (data.success !== true) {
      console.warn('[turnstile] token rejected:', data['error-codes'] ?? res.status);
      return false;
    }
    return true;
  } catch (error) {
    // Cloudflare unreachable: fail closed rather than let unchecked posts through.
    console.error('[turnstile] verification request failed:', error);
    return false;
  }
}
