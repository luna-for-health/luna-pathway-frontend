/**
 * Lowercases and strips accents so a search for "emilie" matches "Émilie"
 * (and "francois" matches "François"). NFD splits each accented letter into
 * its base letter + a combining mark, which the regex then removes.
 */
export function normalizeSearchText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
