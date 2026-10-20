import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, "L'e-mail est requis").email('E-mail invalide'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
