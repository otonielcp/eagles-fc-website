// Canonical public origin of the site. eaglesfc.org does not resolve; the live
// site is eaglesfcgi.org. Same env var and default as lib/hiringEmails.ts.
// Server-only: SITE_URL is not a NEXT_PUBLIC_ variable.
export const SITE_URL = (process.env.SITE_URL || "https://eaglesfcgi.org").replace(/\/$/, "");
