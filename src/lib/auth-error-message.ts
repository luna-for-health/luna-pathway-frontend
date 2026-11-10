import { ApiError } from '@/services';

export const TOO_MANY_ATTEMPTS_MESSAGE =
  'Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.';

/** True when the API rejected the request because of rate limiting (HTTP 429). */
export function isTooManyAttempts(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 429;
}

/**
 * Maps an auth API error to a user-facing French message.
 * 429 gets a dedicated message, since Laravel's default one is in English.
 */
export function getAuthErrorMessage(error: unknown, fallback = 'Une erreur est survenue.') {
  if (isTooManyAttempts(error)) return TOO_MANY_ATTEMPTS_MESSAGE;
  if (error instanceof ApiError) return error.response?.message ?? fallback;
  return fallback;
}
