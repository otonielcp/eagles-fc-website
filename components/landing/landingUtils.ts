// Small shared helpers for the public (landing) components. No DOM access, so
// they are safe to call during server rendering as well as in the browser.

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const MIDNIGHT_UTC_SUFFIX = /^T00:00(:00(\.0+)?)?Z?$/;

/**
 * Parse a fixture/ticket date for display or grouping.
 *
 * Fixture dates are calendar days stored as "YYYY-MM-DD". `new Date("2026-11-09")`
 * treats that as UTC midnight, which is the previous evening in Nebraska and
 * renders differently on the (UTC) server and in the visitor's browser. Date-only
 * values — and the same day serialized as UTC midnight — are parsed as local
 * midnight instead, so every environment shows the same day.
 */
export function parseLocalDate(value: string | Date | null | undefined): Date {
  if (value instanceof Date) return value;
  const str = (value ?? '').trim();
  const match = DATE_ONLY.exec(str.slice(0, 10));
  if (match && (str.length === 10 || MIDNIGHT_UTC_SUFFIX.test(str.slice(10)))) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  return new Date(str);
}

export const CREST_FALLBACK = '/EAGLES-CREST.png';

/**
 * Handle a failed <img>: swap to `fallbackSrc` once, and hide the image if there
 * is no fallback or the fallback fails too (so it can never loop). Many logo and
 * thumbnail URLs stored in the database point at purged Cloudinary assets.
 */
export function applyImgFallback(img: HTMLImageElement, fallbackSrc: string | null | undefined): void {
  if (fallbackSrc && img.dataset.fallbackApplied !== 'true') {
    img.dataset.fallbackApplied = 'true';
    // The crest must not be cropped by an `object-cover` photo slot.
    if (fallbackSrc === CREST_FALLBACK) img.style.objectFit = 'contain';
    img.src = fallbackSrc;
    return;
  }
  img.style.visibility = 'hidden';
}

/** Local midnight at the start of today. */
export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/** Turn rich-text editor HTML into plain text for rendering as a text node. */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<(br|\/p|\/div|\/li|\/h[1-6])\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&(#39|#x27|apos);/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Shorten plain text to `max` characters, preferring a word boundary. */
export function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

// Admin fixtures use "FT"; FutbolCore statuses are upper-cased by getClubFixtures.
const FINISHED_STATUSES = new Set(['FT', 'FULL TIME', 'FULLTIME', 'FINISHED', 'COMPLETED', 'FINAL', 'PLAYED', 'AET', 'PEN']);
const LIVE_STATUSES = new Set(['LIVE', 'IN_PROGRESS', 'IN PROGRESS', 'HT', 'HALF_TIME']);

/** True only when the status says the match has been played to completion. */
export function isMatchFinished(status: string | null | undefined): boolean {
  return FINISHED_STATUSES.has((status ?? '').trim().toUpperCase());
}

/** True when the score on the fixture is real (match finished or in progress). */
export function hasRealScore(status: string | null | undefined): boolean {
  const normalized = (status ?? '').trim().toUpperCase();
  return FINISHED_STATUSES.has(normalized) || LIVE_STATUSES.has(normalized);
}

/** Timeline event types (as saved by the admin TimelineManager) that count as goals. */
export const GOAL_EVENT_TYPES = new Set(['GOAL', 'OWN_GOAL', 'PENALTY_SCORED']);

const EVENT_LABELS: Record<string, string> = {
  MATCH_START: 'Kick-off',
  GOAL: 'Goal',
  OWN_GOAL: 'Own goal',
  PENALTY_SCORED: 'Penalty scored',
  PENALTY_MISSED: 'Penalty missed',
  YELLOW_CARD: 'Yellow card',
  RED_CARD: 'Red card',
  SUBSTITUTION: 'Substitution',
  VAR: 'VAR decision',
  HALF_TIME: 'Half time',
  MATCH_END: 'Full time',
  // Older records used lower-case, unseparated types.
  YELLOWCARD: 'Yellow card',
  REDCARD: 'Red card',
};

/** Human-readable label for a timeline event type. */
export function timelineEventLabel(type: string | null | undefined): string {
  const normalized = (type ?? '').trim().toUpperCase();
  if (EVENT_LABELS[normalized]) return EVENT_LABELS[normalized];
  const words = normalized.replace(/_/g, ' ').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
