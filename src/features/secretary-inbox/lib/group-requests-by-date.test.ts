import { describe, expect, it } from 'vitest';

import { groupRequestsByDate } from '@/features/secretary-inbox/lib/group-requests-by-date';
import { makeInboxRequest } from '@/test/factories';

describe('groupRequestsByDate', () => {
  it('groups requests by the day part of receivedAt, keeping order', () => {
    const a = makeInboxRequest({ id: 'a', receivedAt: '1 septembre 2026 - 12:32' });
    const b = makeInboxRequest({ id: 'b', receivedAt: '2 septembre 2026 - 09:00' });
    const c = makeInboxRequest({ id: 'c', receivedAt: '1 septembre 2026 - 16:16' });

    expect(groupRequestsByDate([a, b, c])).toEqual([
      { date: '1 septembre 2026', requests: [a, c] },
      { date: '2 septembre 2026', requests: [b] },
    ]);
  });

  it('returns no groups for an empty list', () => {
    expect(groupRequestsByDate([])).toEqual([]);
  });
});
