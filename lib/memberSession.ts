import { cookies } from "next/headers";
import { createScopedToken, verifyScopedToken } from "@/lib/adminSession";

/**
 * Signed session for the password-gated /members registration form.
 *
 * The password used to be compared in the browser against a NEXT_PUBLIC_ env
 * var, which ships the password in the page's JavaScript, and the "logged in"
 * flag lived in localStorage, which anyone can set. The password is now checked
 * on the server and access is proven by this httpOnly, HMAC-signed cookie.
 */

const SCOPE = "members";
export const MEMBERS_COOKIE_NAME = "members_session";
export const MEMBERS_SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

/** Server-only. NEXT_PUBLIC_ is a fallback so existing deploys keep working; set MEMBERS_PASSWORD and drop it. */
export function getMembersPassword(): string | null {
  return process.env.MEMBERS_PASSWORD ?? process.env.NEXT_PUBLIC_MEMBERS_PASSWORD ?? null;
}

export async function startMembersSession(): Promise<boolean> {
  const token = await createScopedToken(SCOPE, MEMBERS_SESSION_TTL_SECONDS);
  if (!token) return false;
  (await cookies()).set(MEMBERS_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MEMBERS_SESSION_TTL_SECONDS,
  });
  return true;
}

export async function hasMembersSession(): Promise<boolean> {
  try {
    const token = (await cookies()).get(MEMBERS_COOKIE_NAME)?.value;
    return await verifyScopedToken(SCOPE, token);
  } catch {
    return false;
  }
}
