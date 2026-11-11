import { describe, expect, it } from 'vitest';

import { loginSchema } from '@/features/patient-auth/schemas';

describe('loginSchema', () => {
  it('accepts a valid e-mail', () => {
    expect(loginSchema.safeParse({ email: 'patient@example.com' }).success).toBe(true);
  });

  it('rejects an empty or invalid e-mail', () => {
    expect(loginSchema.safeParse({ email: '' }).error?.issues[0]?.message).toBe(
      "L'e-mail est requis"
    );
    expect(loginSchema.safeParse({ email: 'not-an-email' }).error?.issues[0]?.message).toBe(
      'E-mail invalide'
    );
  });
});
