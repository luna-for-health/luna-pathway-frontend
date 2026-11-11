import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearDiagnosticDraft,
  getDiagnosticDraft,
  saveDiagnosticDraft,
} from '@/features/patient-questionnaire/lib/diagnostic-draft';
import type { PatientDocument } from '@/features/patient-questionnaire/lib/documents';

const STORAGE_KEY = 'luna:diagnostic-draft';

describe('diagnostic draft', () => {
  beforeEach(() => {
    clearDiagnosticDraft();
  });

  it('returns the answers saved for the same questionnaire, merged step by step', () => {
    saveDiagnosticDraft('q1', { consultationReasons: ['diagnostic'] });
    saveDiagnosticDraft('q1', { story: 'Douleurs' });

    expect(getDiagnosticDraft('q1')).toEqual({
      consultationReasons: ['diagnostic'],
      story: 'Douleurs',
    });
  });

  it('never shows answers from another questionnaire', () => {
    saveDiagnosticDraft('q1', { story: 'Old answer' });
    expect(getDiagnosticDraft('q2')).toEqual({});

    saveDiagnosticDraft('q2', { hasRecentImaging: true });
    expect(getDiagnosticDraft('q2')).toEqual({ hasRecentImaging: true });
    expect(getDiagnosticDraft('q1')).toEqual({});
  });

  it('mirrors answers to sessionStorage, without the uploaded files', () => {
    const document = { id: 'd1', file: new File(['x'], 'a.pdf'), status: 'uploaded' };
    saveDiagnosticDraft('q1', { story: 'Douleurs', documents: [document as PatientDocument] });

    expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({
      questionnaireId: 'q1',
      answers: { story: 'Douleurs' },
    });
    expect(getDiagnosticDraft('q1').documents).toHaveLength(1);
  });

  it('clears both the memory and the stored copy', () => {
    saveDiagnosticDraft('q1', { story: 'Douleurs' });
    clearDiagnosticDraft();

    expect(getDiagnosticDraft('q1')).toEqual({});
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('restores the stored draft after a page reload', async () => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ questionnaireId: 'q1', answers: { story: 'Saved before reload' } })
    );
    vi.resetModules();
    const reloaded = await import('@/features/patient-questionnaire/lib/diagnostic-draft');

    expect(reloaded.getDiagnosticDraft('q1')).toEqual({ story: 'Saved before reload' });
  });

  it('starts empty when the stored draft is corrupted', async () => {
    sessionStorage.setItem(STORAGE_KEY, '{not json');
    vi.resetModules();
    const reloaded = await import('@/features/patient-questionnaire/lib/diagnostic-draft');

    expect(reloaded.getDiagnosticDraft('q1')).toEqual({});
  });
});
