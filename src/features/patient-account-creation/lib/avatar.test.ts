import { afterEach, describe, expect, it, vi } from 'vitest';

import { getRandomAvatar } from '@/features/patient-account-creation/lib/avatar';

describe('getRandomAvatar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the lowest avatar (10) when random is 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(getRandomAvatar()).toBe(10);
  });

  it('returns the highest avatar (18) when random is just below 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999);
    expect(getRandomAvatar()).toBe(18);
  });
});
