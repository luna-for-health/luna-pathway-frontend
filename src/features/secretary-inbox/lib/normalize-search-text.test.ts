import { describe, expect, it } from 'vitest';

import { normalizeSearchText } from '@/features/secretary-inbox/lib/normalize-search-text';

describe('normalizeSearchText', () => {
  it('lowercases, strips accents and trims', () => {
    expect(normalizeSearchText('  Émilie FRANÇOIS ')).toBe('emilie francois');
  });
});
