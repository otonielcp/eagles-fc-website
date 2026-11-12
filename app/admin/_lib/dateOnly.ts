import { format } from "date-fns";

/**
 * Helpers for calendar dates such as birthdates. These are stored either as a
 * "YYYY-MM-DD" string (member registrations) or as UTC midnight of that day
 * (players and staff, serialized as "YYYY-MM-DDT00:00:00.000Z"). Passing
 * either to `new Date()` and formatting in local time shows the previous day
 * anywhere west of UTC, so these read the date parts directly instead.
 *
 * Lives in a private `_lib` folder so the App Router never treats it as a route.
 */

type DateParts = { year: number; month: number; day: number };

export function parseDateOnly(value: string | null | undefined): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

/** Formats the stored calendar date with a date-fns pattern, e.g. "MM/dd/yyyy". */
export function formatDateOnly(value: string | null | undefined, pattern = "MM/dd/yyyy"): string {
  const parts = parseDateOnly(value);
  if (!parts) return "N/A";
  return format(new Date(parts.year, parts.month - 1, parts.day), pattern);
}

/** Whole years since the date, counting the birthday only once it has arrived. */
export function ageFromDateOnly(value: string | null | undefined): number | null {
  const parts = parseDateOnly(value);
  if (!parts) return null;
  const today = new Date();
  const month = today.getMonth() + 1;
  let age = today.getFullYear() - parts.year;
  if (month < parts.month || (month === parts.month && today.getDate() < parts.day)) {
    age--;
  }
  return age;
}
