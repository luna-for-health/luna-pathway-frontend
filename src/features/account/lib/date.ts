const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join('/');
}

export function parseDateOfBirth(value: string) {
  const match = DATE_PATTERN.exec(value);
  if (!match) return undefined;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  const isRealCalendarDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isRealCalendarDate ? date : undefined;
}

export function isFutureDate(date: Date) {
  return date.getTime() > Date.now();
}

export function toIsoDate(value: string) {
  const date = parseDateOfBirth(value);
  if (!date) return undefined;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
