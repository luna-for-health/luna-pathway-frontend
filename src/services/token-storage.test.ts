import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { tokenStorage } from '@/services/token-storage';

describe('tokenStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stores and reads the token with its role', () => {
    tokenStorage.set('abc', 'patient');
    expect(tokenStorage.get()).toBe('abc');
    expect(tokenStorage.getRole()).toBe('patient');
  });

  it('removes the token and the role', () => {
    tokenStorage.set('abc', 'secretary');
    tokenStorage.remove();
    expect(tokenStorage.get()).toBeNull();
    expect(tokenStorage.getRole()).toBeNull();
  });

  it('treats a token without a known role as logged out', () => {
    localStorage.setItem('luna-auth-token', 'old-token');
    expect(tokenStorage.getRole()).toBeNull();

    localStorage.setItem('luna-auth-role', 'admin');
    expect(tokenStorage.getRole()).toBeNull();
  });

  it('has no role when there is no token', () => {
    localStorage.setItem('luna-auth-role', 'patient');
    expect(tokenStorage.getRole()).toBeNull();
  });

  it('notifies subscribers on set and remove, until they unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = tokenStorage.subscribe(listener);

    tokenStorage.set('abc', 'patient');
    tokenStorage.remove();
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    tokenStorage.set('def', 'patient');
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('reacts to auth changes made in another tab, and ignores other keys', () => {
    const listener = vi.fn();
    const unsubscribe = tokenStorage.subscribe(listener);

    window.dispatchEvent(new StorageEvent('storage', { key: 'luna-auth-token' }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'luna-auth-role' }));
    window.dispatchEvent(new StorageEvent('storage', { key: null }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'something-else' }));
    expect(listener).toHaveBeenCalledTimes(3);

    unsubscribe();
    window.dispatchEvent(new StorageEvent('storage', { key: 'luna-auth-token' }));
    expect(listener).toHaveBeenCalledTimes(3);
  });
});
