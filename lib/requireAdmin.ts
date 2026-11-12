import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/adminSession";

/**
 * Server actions are public POST endpoints: middleware only guards /admin page
 * requests, not the action calls those pages make. Any action that reads or
 * changes admin-only data must call this first.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
}

/** Non-throwing check, for public reads that show admins a little more (e.g. draft news). */
export async function isAdmin(): Promise<boolean> {
  try {
    const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
    return await verifySessionToken(token);
  } catch {
    return false;
  }
}
