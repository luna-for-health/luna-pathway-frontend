import { z } from 'zod';

export const loginSecretarySchema = z.object({
  email: z.string().min(1, "L'e-mail est requis").email('E-mail invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export type LoginSecretaryFormValues = z.infer<typeof loginSecretarySchema>;

export const forgotPasswordSecretarySchema = z.object({
  email: z.string().min(1, "L'e-mail est requis").email('E-mail invalide'),
});

export type ForgotPasswordSecretaryFormValues = z.infer<typeof forgotPasswordSecretarySchema>;

export const resetPasswordSecretarySchema = z
  .object({
    code: z.string().trim().min(1, 'Le code est requis'),
    password: z
      .string()
      .min(1, 'Le mot de passe est requis')
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    passwordConfirmation: z.string().min(1, 'La confirmation est requise'),
  })
  .refine(values => values.password === values.passwordConfirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirmation'],
  });

export type ResetPasswordSecretaryFormValues = z.infer<typeof resetPasswordSecretarySchema>;
