import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/adminSession";

/**
 * Server actions are public POST endpoints: middleware only guards /admin page
 * requests, not the action calls those pages make. Any action that reads or
 * changes admin-only data must call this first.
 */
export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) {
    throw new Error("Unauthorized");
  }
}
