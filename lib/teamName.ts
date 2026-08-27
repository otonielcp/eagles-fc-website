/**
 * Display labels for club teams.
 *
 * FutbolCore's `shortName` is not trustworthy: "Eagles FC Black U10" is labelled
 * "U9", two different teams both claim "U9 Boys", four say "Eagles Football Club",
 * and two are empty. Rendering that in a menu gives duplicate and plainly wrong
 * entries, so we derive the label from `name`, which is always distinctive, and
 * only fall back to `shortName` when stripping leaves nothing behind.
 */

type NameableTeam = {
  name?: string;
  shortName?: string;
  category?: string;
};

const GENERIC_SHORT = /^eagles\s*football\s*club$/i;

const stripEaglesPrefix = (value: string) =>
  value.replace(/^(eagles\s*football\s*club|eagles?\s*fc)\s*-?\s*/i, '').trim();

export function getTeamDisplayName(team: NameableTeam): string {
  const cleaned = stripEaglesPrefix(team.name || '');
  if (cleaned) return cleaned;

  const shortName = team.shortName || '';
  if (shortName && !GENERIC_SHORT.test(shortName)) return shortName;

  return team.category || team.name || '';
}
