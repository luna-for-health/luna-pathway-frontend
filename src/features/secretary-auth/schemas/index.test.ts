import { describe, expect, it } from 'vitest';

import {
  forgotPasswordSecretarySchema,
  loginSecretarySchema,
  resetPasswordSecretarySchema,
} from '@/features/secretary-auth/schemas';

describe('loginSecretarySchema', () => {
  it('requires an e-mail and a password', () => {
    expect(
      loginSecretarySchema.safeParse({ email: 'sec@example.com', password: 'secret' }).success
    ).toBe(true);
    expect(
      loginSecretarySchema.safeParse({ email: 'sec@example.com', password: '' }).error?.issues[0]
        ?.message
    ).toBe('Le mot de passe est requis');
  });
});

describe('forgotPasswordSecretarySchema', () => {
  it('rejects an invalid e-mail', () => {
    expect(forgotPasswordSecretarySchema.safeParse({ email: 'nope' }).success).toBe(false);
  });
});

describe('resetPasswordSecretarySchema', () => {
  const valid = { code: '123456', password: 'longpassword', passwordConfirmation: 'longpassword' };

  it('accepts matching passwords of 8+ characters', () => {
    expect(resetPasswordSecretarySchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = resetPasswordSecretarySchema.safeParse({
      ...valid,
      password: 'short',
      passwordConfirmation: 'short',
    });
    expect(result.error?.issues[0]?.message).toBe(
      'Le mot de passe doit contenir au moins 8 caractères'
    );
  });

  it('rejects passwords that do not match, on the confirmation field', () => {
    const issue = resetPasswordSecretarySchema.safeParse({
      ...valid,
      passwordConfirmation: 'different1',
    }).error?.issues[0];
    expect(issue?.message).toBe('Les mots de passe ne correspondent pas');
    expect(issue?.path).toEqual(['passwordConfirmation']);
  });

  it('rejects a code made only of spaces', () => {
    expect(resetPasswordSecretarySchema.safeParse({ ...valid, code: '   ' }).success).toBe(false);
  });
});
