import { describe, expect, it } from 'vitest';

import { formatInboxTimestamp } from '@/features/secretary-inbox/lib/format-inbox-timestamp';

describe('formatInboxTimestamp', () => {
  it('formats as "day month year - HH:MM" in French', () => {
    expect(formatInboxTimestamp(new Date(2026, 8, 1, 16, 16))).toBe('1 septembre 2026 - 16:16');
  });

  it('pads hours and minutes', () => {
    expect(formatInboxTimestamp(new Date(2026, 0, 5, 9, 5))).toBe('5 janvier 2026 - 09:05');
  });
});
