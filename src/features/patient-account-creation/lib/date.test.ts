import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  formatDateInput,
  isFutureDate,
  parseDateOfBirth,
  toIsoDate,
} from '@/features/patient-account-creation/lib/date';

describe('formatDateInput', () => {
  it('adds slashes as the patient types', () => {
    expect(formatDateInput('')).toBe('');
    expect(formatDateInput('1')).toBe('1');
    expect(formatDateInput('120')).toBe('12/0');
    expect(formatDateInput('12031990')).toBe('12/03/1990');
  });

  it('ignores non-digit characters and extra digits', () => {
    expect(formatDateInput('12/03/1990')).toBe('12/03/1990');
    expect(formatDateInput('12a03b1990')).toBe('12/03/1990');
    expect(formatDateInput('1203199012')).toBe('12/03/1990');
  });
});

describe('parseDateOfBirth', () => {
  it('parses a valid DD/MM/YYYY date', () => {
    const date = parseDateOfBirth('12/03/1990');
    expect(date?.getFullYear()).toBe(1990);
    expect(date?.getMonth()).toBe(2);
    expect(date?.getDate()).toBe(12);
  });

  it('accepts 29 February in a leap year', () => {
    expect(parseDateOfBirth('29/02/2000')).toBeInstanceOf(Date);
  });

  it('rejects dates that do not exist in the calendar', () => {
    expect(parseDateOfBirth('31/02/1990')).toBeUndefined();
    expect(parseDateOfBirth('29/02/2001')).toBeUndefined();
    expect(parseDateOfBirth('00/01/1990')).toBeUndefined();
    expect(parseDateOfBirth('12/13/1990')).toBeUndefined();
  });

  it('rejects anything that is not DD/MM/YYYY', () => {
    expect(parseDateOfBirth('')).toBeUndefined();
    expect(parseDateOfBirth('1990-03-12')).toBeUndefined();
    expect(parseDateOfBirth('1/3/1990')).toBeUndefined();
  });
});

describe('isFutureDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 11, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is true for a date after now', () => {
    expect(isFutureDate(new Date(2026, 10, 12))).toBe(true);
  });

  it('is false for a date before now', () => {
    expect(isFutureDate(new Date(1990, 2, 12))).toBe(false);
  });
});

describe('toIsoDate', () => {
  it('converts DD/MM/YYYY to YYYY-MM-DD', () => {
    expect(toIsoDate('05/03/1990')).toBe('1990-03-05');
  });

  it('returns undefined for an invalid date', () => {
    expect(toIsoDate('31/02/1990')).toBeUndefined();
    expect(toIsoDate('abc')).toBeUndefined();
  });
});
