import { describe, expect, it } from 'vitest';

import {
  accountBirthdateSchema,
  accountNameSchema,
  accountPhoneSchema,
} from '@/features/patient-account-creation/schemas';

function firstError(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  return result.error?.issues[0]?.message;
}

describe('accountNameSchema', () => {
  it('accepts a first and last name', () => {
    expect(accountNameSchema.safeParse({ firstName: 'Amel', lastName: 'Ben Ali' }).success).toBe(
      true
    );
  });

  it('requires both names', () => {
    expect(firstError(accountNameSchema.safeParse({ firstName: '', lastName: 'X' }))).toBe(
      'Le prénom est requis'
    );
  });
});

describe('accountBirthdateSchema', () => {
  it('accepts a valid past date', () => {
    expect(accountBirthdateSchema.safeParse({ birthdate: '12/03/1990' }).success).toBe(true);
  });

  it('rejects an impossible date', () => {
    expect(firstError(accountBirthdateSchema.safeParse({ birthdate: '31/02/1990' }))).toBe(
      'Date invalide, format attendu JJ/MM/AAAA'
    );
  });

  it('rejects a date in the future', () => {
    expect(firstError(accountBirthdateSchema.safeParse({ birthdate: '01/01/2999' }))).toBe(
      'La date de naissance ne peut pas être dans le futur'
    );
  });
});

describe('accountPhoneSchema', () => {
  it('accepts a 10-digit number', () => {
    expect(accountPhoneSchema.safeParse({ phone: '06 12 34 56 78' }).success).toBe(true);
  });

  it('rejects a short number', () => {
    expect(firstError(accountPhoneSchema.safeParse({ phone: '06 12' }))).toBe(
      'Numéro de téléphone invalide'
    );
  });
});
