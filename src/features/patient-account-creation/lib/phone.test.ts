import { describe, expect, it } from 'vitest';

import {
  formatPhoneInput,
  isValidFrenchPhone,
  toE164FrenchPhone,
} from '@/features/patient-account-creation/lib/phone';

describe('formatPhoneInput', () => {
  it('groups digits by two', () => {
    expect(formatPhoneInput('0612345678')).toBe('06 12 34 56 78');
    expect(formatPhoneInput('061')).toBe('06 1');
  });

  it('ignores non-digits and stops at 10 digits', () => {
    expect(formatPhoneInput('06-12.34 56 78 99')).toBe('06 12 34 56 78');
  });

  it('returns an empty string for empty input', () => {
    expect(formatPhoneInput('')).toBe('');
  });
});

describe('isValidFrenchPhone', () => {
  it('accepts any 10-digit number, with or without spaces', () => {
    expect(isValidFrenchPhone('06 12 34 56 78')).toBe(true);
    expect(isValidFrenchPhone('1234567890')).toBe(true);
  });

  it('rejects numbers with the wrong length or letters', () => {
    expect(isValidFrenchPhone('06 12 34 56')).toBe(false);
    expect(isValidFrenchPhone('06123456789')).toBe(false);
    expect(isValidFrenchPhone('06123456ab')).toBe(false);
  });
});

describe('toE164FrenchPhone', () => {
  it('replaces the leading 0 with +33', () => {
    expect(toE164FrenchPhone('06 12 34 56 78')).toBe('+33612345678');
  });

  it('keeps numbers without a leading 0 as they are', () => {
    expect(toE164FrenchPhone('6123456789')).toBe('+336123456789');
  });
});
