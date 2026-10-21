/**
 * `GET /ai-assistant/skills` — shape not confirmed yet. Swagger's `"string"` example has
 * already proven unreliable for this API before, so the raw payload is treated as `unknown`
 * and normalized defensively in `useAiAssistantSkills` until a real response confirms the
 * actual shape.
 */
export type AiAssistantSkillsResponseData = unknown;

export interface SkillOption {
  id: string;
  label: string;
}

/** EVA symptom scores, 0 (absent) … 10 (insupportable). */
export interface ConsultationRequestSymptomScores {
  dysmenorrhea: number;
  pelvicPain: number;
  dyspareunia: number;
  digestiveIssues: number;
  urinaryIssues: number;
  fatigue: number;
}

export interface ConsultationRequestPayload extends ConsultationRequestSymptomScores {
  reason: string;
  history?: string;
  /** Answer to the PatientImaging step (échographie/IRM < 12 months) — sent as `has_mri`. */
  hasMri: boolean;
  documents?: File[];
}

/**
 * `POST /consultation-requests` — response shape not confirmed yet (only the request body
 * was specified). Treated as `unknown`, same caution as `AiAssistantSkillsResponseData`
 * above, until a real response confirms the actual shape.
 */
export type ConsultationRequestResponseData = unknown;
