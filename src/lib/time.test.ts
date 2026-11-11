import { afterEach, describe, expect, it, vi } from 'vitest';

import { now } from '@/lib/time';

describe('now', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the current timestamp', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-11T12:00:00Z'));
    expect(now()).toBe(new Date('2026-11-11T12:00:00Z').getTime());
  });
});
