import type { PatientDocument } from '@/features/patient-questionnaire/lib/documents';
import type { DiagnosticDraftState } from '@/features/patient-questionnaire/types';

/**
 * Answers the patient has given so far in the `/diagnostic/step-*` questionnaire, kept
 * outside of route state so they survive going BACK.
 *
 * Why route state alone isn't enough: each step forwards its answer via
 * `navigate(next, { state })`, so the answer only lives on the NEXT step's history entry.
 * `navigate(-1)` returns to the previous entry, whose `location.state` is what came *into*
 * that step — without the answer the patient gave on it — so the screen came back empty.
 *
 * Every step now initialises from this draft first (falling back to route state) and writes
 * its answer back whenever it changes. The draft is keyed by `questionnaireId`, so starting a
 * new questionnaire (new id from the intro screen) never shows a previous attempt's answers;
 * it's also cleared after a successful submit.
 *
 * Serializable answers are mirrored to sessionStorage so a page reload mid-flow keeps them;
 * uploaded `File`s can't be serialized, so documents are kept in memory only.
 */
export interface DiagnosticDraftAnswers {
  consultationReasons?: string[];
  story?: string;
  storyInputMethod?: DiagnosticDraftState['storyInputMethod'];
  symptomScores?: Record<string, number>;
  hasRecentImaging?: boolean;
  documents?: PatientDocument[];
}

interface DiagnosticDraft {
  questionnaireId?: string;
  answers: DiagnosticDraftAnswers;
}

const STORAGE_KEY = 'luna:diagnostic-draft';

let draft: DiagnosticDraft = readStoredDraft();

function readStoredDraft(): DiagnosticDraft {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DiagnosticDraft) : { answers: {} };
  } catch {
    return { answers: {} };
  }
}

function writeStoredDraft(value: DiagnosticDraft) {
  try {
    const { documents: _documents, ...serializable } = value.answers;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ questionnaireId: value.questionnaireId, answers: serializable })
    );
  } catch {
    // Storage unavailable (private mode, quota) — the in-memory draft still works.
  }
}

export function getDiagnosticDraft(questionnaireId: string): DiagnosticDraftAnswers {
  return draft.questionnaireId === questionnaireId ? draft.answers : {};
}

export function saveDiagnosticDraft(questionnaireId: string, patch: DiagnosticDraftAnswers) {
  const answers = draft.questionnaireId === questionnaireId ? draft.answers : {};
  draft = { questionnaireId, answers: { ...answers, ...patch } };
  writeStoredDraft(draft);
}

export function clearDiagnosticDraft() {
  draft = { answers: {} };
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
