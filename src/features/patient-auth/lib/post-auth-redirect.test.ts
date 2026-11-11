import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  consumePostAuthRedirect,
  savePostAuthRedirect,
} from '@/features/patient-auth/lib/post-auth-redirect';

describe('post-auth redirect', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the saved page once, then the fallback', () => {
    savePostAuthRedirect('/diagnostic/story');
    expect(consumePostAuthRedirect('/home')).toBe('/diagnostic/story');
    expect(consumePostAuthRedirect('/home')).toBe('/home');
  });

  it('returns the fallback when nothing was saved', () => {
    expect(consumePostAuthRedirect('/home')).toBe('/home');
  });

  it('never resumes an account-creation step', () => {
    savePostAuthRedirect('/account/step-2');
    expect(consumePostAuthRedirect('/home')).toBe('/home');
  });

  it('ignores paths that are not internal', () => {
    savePostAuthRedirect('https://evil.example.com');
    expect(consumePostAuthRedirect('/home')).toBe('/home');
  });

  it('does not throw when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => savePostAuthRedirect('/x')).not.toThrow();
    expect(consumePostAuthRedirect('/home')).toBe('/home');
  });
});
