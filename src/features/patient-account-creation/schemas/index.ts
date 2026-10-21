import { z } from 'zod';

import { isFutureDate, parseDateOfBirth } from '@/features/patient-account-creation/lib/date';
import { isValidFrenchPhone } from '@/features/patient-account-creation/lib/phone';

export const accountNameSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom de famille est requis'),
});

export type AccountNameFormValues = z.infer<typeof accountNameSchema>;

export const accountBirthdateSchema = z.object({
  birthdate: z
    .string()
    .min(1, 'La date de naissance est requise')
    .refine(value => Boolean(parseDateOfBirth(value)), 'Date invalide, format attendu JJ/MM/AAAA')
    .refine(value => {
      const date = parseDateOfBirth(value);
      return !date || !isFutureDate(date);
    }, 'La date de naissance ne peut pas être dans le futur'),
});

export type AccountBirthdateFormValues = z.infer<typeof accountBirthdateSchema>;

export const accountPhoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .refine(isValidFrenchPhone, 'Numéro de téléphone invalide'),
});

export type AccountPhoneFormValues = z.infer<typeof accountPhoneSchema>;
