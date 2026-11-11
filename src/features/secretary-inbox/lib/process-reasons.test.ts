import { describe, expect, it } from 'vitest';

import {
  getInboxProcessReasonBadgeColor,
  getInboxProcessReasonBadgeLabel,
  INBOX_PROCESS_REASONS,
  toInboxProcessReason,
} from '@/features/secretary-inbox/lib/process-reasons';

describe('toInboxProcessReason', () => {
  it('keeps known reasons', () => {
    for (const option of INBOX_PROCESS_REASONS) {
      expect(toInboxProcessReason(option.value)).toBe(option.value);
    }
  });

  it('drops unknown, empty and missing values', () => {
    expect(toInboxProcessReason('something-else')).toBeUndefined();
    expect(toInboxProcessReason('')).toBeUndefined();
    expect(toInboxProcessReason(null)).toBeUndefined();
    expect(toInboxProcessReason(undefined)).toBeUndefined();
  });
});

describe('badge label and color', () => {
  it('uses orange for contact failures and gray for dismissals', () => {
    expect(getInboxProcessReasonBadgeColor('wrong-phone')).toBe('warning');
    expect(getInboxProcessReasonBadgeColor('not-interested')).toBe('neutral');
  });

  it('uses the short badge copy', () => {
    expect(getInboxProcessReasonBadgeLabel('seen-elsewhere')).toBe('Vue ailleurs');
  });
});
