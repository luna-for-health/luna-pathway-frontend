import type { ConsultationRequestSymptomScores } from '@/features/diagnostic/api/types';

export interface Symptom {
  id: string;
  title: string;
  description: string;
}

/**
 * Symptoms rated on the "Vos symptômes" EVA screen (`/diagnostic/step-4`, Figma node
 * 7592:6138) — copy is verbatim from the design. Ids match the `symptom_scores` column names
 * in the Notion spec ("Spécifications fonctionnelles — Questionnaire de pré-consultation",
 * étape 3) and key `DiagnosticDraftState.symptomScores` and analytics.
 */
export const SYMPTOMS: Symptom[] = [
  { id: 'dysmenorrhea', title: 'Douleur pendant les règles', description: 'Dysménorrhée' },
  {
    id: 'pelvic_pain',
    title: 'Douleurs dans le bas ventre',
    description: 'Douleurs peleviennes',
  },
  {
    id: 'dyspareunia',
    title: 'Douleur pendant les rapports sexuels',
    description: 'Dyspareunies',
  },
  {
    id: 'digestive_issues',
    title: 'Troubles digestifs',
    description: 'Ballonnements, diarrhée, constipation, douleurs digestives…',
  },
  {
    id: 'urinary_issues',
    title: 'Troubles urinaires',
    description: 'Douleurs ou brûlures en urinant, envies fréquentes ou urgentes…',
  },
  {
    id: 'fatigue',
    title: 'Fatigue',
    description: 'Fatigue générale, manque d’énergie au quotidien.',
  },
];

/** Maps `DiagnosticDraftState.symptomScores` (snake_case ids) to the API's camelCase fields. */
export function toSymptomScoresPayload(
  scores?: Record<string, number>
): ConsultationRequestSymptomScores {
  return {
    dysmenorrhea: scores?.dysmenorrhea ?? 0,
    pelvicPain: scores?.pelvic_pain ?? 0,
    dyspareunia: scores?.dyspareunia ?? 0,
    digestiveIssues: scores?.digestive_issues ?? 0,
    urinaryIssues: scores?.urinary_issues ?? 0,
    fatigue: scores?.fatigue ?? 0,
  };
}
