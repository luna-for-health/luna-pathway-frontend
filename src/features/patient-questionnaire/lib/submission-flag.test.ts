import { beforeEach, describe, expect, it } from 'vitest';

import {
  consumeJustSubmitted,
  markJustSubmitted,
} from '@/features/patient-questionnaire/lib/submission-flag';

describe('submission flag', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('is true once after a submit, then false (e.g. on reload)', () => {
    markJustSubmitted();
    expect(consumeJustSubmitted()).toBe(true);
    expect(consumeJustSubmitted()).toBe(false);
  });

  it('is false when nothing was submitted', () => {
    expect(consumeJustSubmitted()).toBe(false);
  });
});
