import { describe, expect, it } from 'vitest';

import {
  getInboxStatusIconClassName,
  getInboxStatusLabel,
  getInboxStatusTimestamp,
  isInboxRequestTreated,
} from '@/features/secretary-inbox/lib/inbox-status';
import { makeInboxRequest } from '@/test/factories';

const receivedAt = '1 septembre 2026 - 12:32';
const processedAt = '3 septembre 2026 - 10:00';

describe('isInboxRequestTreated', () => {
  it('is true for a treated outcome or when a reason was picked', () => {
    expect(isInboxRequestTreated(makeInboxRequest({ outcome: 'treated' }))).toBe(true);
    expect(isInboxRequestTreated(makeInboxRequest({ processReason: 'wrong-phone' }))).toBe(true);
  });

  it('is false for a validated appointment', () => {
    expect(isInboxRequestTreated(makeInboxRequest({ outcome: 'validated' }))).toBe(false);
  });
});

describe('getInboxStatusTimestamp', () => {
  it('prefers processedAt and falls back to receivedAt', () => {
    expect(getInboxStatusTimestamp(makeInboxRequest({ receivedAt, processedAt }))).toBe(
      processedAt
    );
    expect(getInboxStatusTimestamp(makeInboxRequest({ receivedAt }))).toBe(receivedAt);
  });
});

describe('getInboxStatusLabel', () => {
  it('describes a reminder', () => {
    expect(getInboxStatusLabel(makeInboxRequest({ status: 'reminder', processedAt }))).toBe(
      `Mise en rappel le ${processedAt}`
    );
  });

  it('describes a treated request', () => {
    const request = makeInboxRequest({ status: 'processed', outcome: 'treated', processedAt });
    expect(getInboxStatusLabel(request)).toBe(`Traité le ${processedAt}`);
  });

  it('describes a validated appointment', () => {
    const request = makeInboxRequest({ status: 'processed', outcome: 'validated', processedAt });
    expect(getInboxStatusLabel(request)).toBe(`RDV validé le ${processedAt}`);
  });
});

describe('getInboxStatusIconClassName', () => {
  it('is green only for a validated appointment', () => {
    expect(
      getInboxStatusIconClassName(makeInboxRequest({ status: 'processed', outcome: 'validated' }))
    ).toBe('text-badge-success-text');
    expect(
      getInboxStatusIconClassName(makeInboxRequest({ status: 'processed', outcome: 'treated' }))
    ).toBe('text-body-tertiary');
    expect(getInboxStatusIconClassName(makeInboxRequest({ status: 'reminder' }))).toBe(
      'text-body-tertiary'
    );
  });
});
