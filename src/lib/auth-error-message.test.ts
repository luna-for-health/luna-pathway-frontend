import { describe, expect, it } from 'vitest';

import {
  getAuthErrorMessage,
  isTooManyAttempts,
  TOO_MANY_ATTEMPTS_MESSAGE,
} from '@/lib/auth-error-message';
import { ApiError } from '@/services';

function apiResponse(message: string): IResponse {
  return { status: 'error', success: false, message, data: null };
}

describe('isTooManyAttempts', () => {
  it('is true for a 429 API error', () => {
    expect(isTooManyAttempts(new ApiError('Too Many Attempts.', 429))).toBe(true);
  });

  it('is false for other API errors', () => {
    expect(isTooManyAttempts(new ApiError('Invalid code', 422))).toBe(false);
  });

  it('is false for non-API errors', () => {
    expect(isTooManyAttempts(new Error('Network error'))).toBe(false);
    expect(isTooManyAttempts(undefined)).toBe(false);
  });
});

describe('getAuthErrorMessage', () => {
  it('returns the French rate-limit message for a 429, ignoring the backend text', () => {
    const error = new ApiError('Too Many Attempts.', 429, apiResponse('Too Many Attempts.'));
    expect(getAuthErrorMessage(error)).toBe(TOO_MANY_ATTEMPTS_MESSAGE);
  });

  it('returns the backend message for other API errors', () => {
    const error = new ApiError('Unprocessable', 422, apiResponse('Code invalide.'));
    expect(getAuthErrorMessage(error)).toBe('Code invalide.');
  });

  it('returns the fallback when the API error has no response body', () => {
    const error = new ApiError('Server error', 500);
    expect(getAuthErrorMessage(error, 'Réessayez plus tard.')).toBe('Réessayez plus tard.');
  });

  it('returns the default fallback for non-API errors', () => {
    expect(getAuthErrorMessage(new Error('Failed to fetch'))).toBe('Une erreur est survenue.');
  });
});
