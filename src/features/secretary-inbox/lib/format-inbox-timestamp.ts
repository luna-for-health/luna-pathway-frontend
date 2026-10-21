const DATE_FORMATTER = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Formats a date the way inbox timestamps read in the Figma mocks:
 * "1 septembre 2026 - 16:16".
 */
export function formatInboxTimestamp(date: Date = new Date()): string {
  return `${DATE_FORMATTER.format(date)} - ${TIME_FORMATTER.format(date)}`;
}
