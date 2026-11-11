import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/utils';

describe('cn', () => {
  it('joins class names and drops falsy ones', () => {
    const isActive = false;
    expect(cn('a', isActive && 'b', undefined, null, 'c')).toBe('a c');
  });

  it('lets later Tailwind classes override earlier ones', () => {
    expect(cn('px-2 text-sm', 'px-4')).toBe('text-sm px-4');
  });
});
