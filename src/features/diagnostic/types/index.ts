import type * as React from 'react';

/**
 * UI-side chat turn — mirrors `ChatMessage` (api/types.ts) plus a client-only `id` for React
 * list keys. Stripped back down to `{ role, content }` before being sent as
 * `conversation_history`; kept separate from the api type so this file stays UI-only, in
 * line with the rest of the feature's `types/index.ts` files.
 */
export interface DiagnosticMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ConversationThreadProps {
  messages: DiagnosticMessage[];
}

/** `SkillOption` (api/types.ts) list, rendered as a selectable left-hand panel. */
export interface SkillPickerProps {
  skills: { id: string; label: string }[];
  selectedSkillId: string;
  onSelect: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * "flow / step 1" option card (Figma node 7245:11386) — a two-line title + description
 * multi-select toggle. Distinct from the generic `Option` DS primitive (`components/ui`),
 * which only supports a single-line label (see its doc comment) — this is a page-specific
 * composed variant, not a DS primitive extension.
 */
export interface ConsultationReasonOptionProps extends Omit<
  React.ComponentProps<'button'>,
  'title'
> {
  title: string;
  description: string;
  selected?: boolean;
}

/**
 * Shared shape threaded through `navigate(path, { state })` across the `/diagnostic/step-*`
 * screens — same pattern as `AccountDraftState` in the `account` feature. Extend as more
 * steps are added rather than inventing a new ad hoc state shape per step.
 */
export interface DiagnosticDraftState {
  consultationReasons?: string[];
  story?: string;
  /**
   * The actual uploaded `File` objects, threaded through route state (structured-clone
   * supports `File`) so `RequestSummary` can attach them to the `POST /consultation-requests`
   * multipart submission.
   */
  documents?: File[];
  /**
   * Whether the patient reported having an échographie/IRM dated less than 12 months
   * ("step 3A / open question", Figma node 7371:4645, inserted between the patient story and
   * document upload steps). No confirmed backend field for this answer yet — threaded through
   * route state only, same "not wired to the API yet" placeholder pattern as the rest of this
   * flow until a contract is confirmed.
   */
  hasRecentImaging?: boolean;
  /**
   * EVA scores (0 = absent … 10 = insupportable) keyed by `SYMPTOMS[].id`
   * (`lib/symptoms.ts`), from the "Vos symptômes" screen (`/diagnostic/step-4`, Figma node
   * 7592:6138). Sent to `POST /consultation-requests` as camelCase fields via
   * `toSymptomScoresPayload`.
   */
  symptomScores?: Record<string, number>;
  /**
   * Generated once, the first time a `/diagnostic/*` screen is reached without one already in
   * state (see `getOrCreateQuestionnaireId` in `lib/analytics.ts`), then threaded forward on
   * every `navigate(path, { state })` call the same way as the rest of this shape. Ties every
   * `*_PRE_RDV_*` tracking event in a single attempt together (`questionnaire_id` prop) — see
   * the "Tracking plan patient" Notion doc.
   */
  questionnaireId?: string;
  /** `Date.now()` when `START_PRE_RDV_QUESTIONNAIRE` fires (intro "Commencer" click) — used to
   * compute `SUBMIT_PRE_RDV_QUESTIONNAIRE`'s `time_to_complete_sec`. */
  questionnaireStartedAt?: number;
  /** How the patient story (step 2) was composed — typed, dictated, or both — set in
   * `PatientStory` and threaded forward so `SUBMIT_PRE_RDV_QUESTIONNAIRE`'s
   * `story_input_method` doesn't need step 2's local state re-derived at step 6. */
  storyInputMethod?: 'text' | 'voice' | 'mixed' | 'none';
}

/**
 * "step 3 / uploaded" document-list row (Figma node 6767:3898's "document line" /
 * "uploading-document line" variants) — a single row in the upload card, either mid-upload
 * (spinner + status text) or finished (view/delete actions).
 */
export type PatientDocumentRowProps =
  | { name: string; status: 'uploading' }
  | { name: string; status: 'uploaded'; onView: () => void; onDelete: () => void };

/**
 * Figma's delete-confirm dialog (node 6773:4146) hides everything behind its overlay except
 * the header's logo — no "Étape 4/4" label either (`DesktopHeader`'s children/slot is empty
 * on that node). `PatientDocuments` owns the delete-dialog's open state internally, so it
 * reports open/closed changes up to `PatientDocumentsScreen`, which controls `WebHeader`'s
 * `centerContent` — rather than lifting the whole delete-flow state (and its `documents`
 * coupling) up to the screen.
 */
export interface PatientDocumentsProps {
  onDeleteDialogOpenChange?: (open: boolean) => void;
}

/**
 * "summary" screen (Figma node 7251:12664, "Validez votre demande") answer-card row — a
 * checkmark title + the recorded answer text, repeated for motif/histoire/documents.
 */
export interface SummaryAnswerProps {
  title: string;
  children: React.ReactNode;
}
