import { useEffect, useRef, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Card, EvaSlider } from '@/components/ui';
import { usePreRdvScreenView } from '@/features/patient-questionnaire/hooks';
import { getOrCreateQuestionnaireId } from '@/features/patient-questionnaire/lib/analytics';
import {
  getDiagnosticDraft,
  saveDiagnosticDraft,
} from '@/features/patient-questionnaire/lib/diagnostic-draft';
import { SYMPTOMS } from '@/features/patient-questionnaire/lib/symptoms';
import type { DiagnosticDraftState } from '@/features/patient-questionnaire/types';
import { ArrowBackIcon, ArrowForwardIcon, MoonIcon } from '@/icons';
import { now } from '@/lib/time';
import { AnalyticsEvent, analytics } from '@/services';

function getInitialScores(saved?: Record<string, number>): Record<string, number> {
  return Object.fromEntries(SYMPTOMS.map(symptom => [symptom.id, saved?.[symptom.id] ?? 0]));
}

/**
 * "step 3 / eva sliders" (Figma node 7592:6138, "Étape 3/4") — the patient rates each symptom
 * from 0 (absent) to 10 (insupportable) on an EVA slider. Sits between the patient story
 * (`/diagnostic/step-3`) and the recent-imaging question (`/diagnostic/step-5`).
 *
 * Every slider starts at 0, which is a valid answer ("absent"), so "Suivant" is always enabled
 * — Figma's "No documents = disabled" annotation on this frame's button is a leftover copied
 * from the upload screen. Scores are threaded through `DiagnosticDraftState.symptomScores`
 * and sent to `POST /consultation-requests` by `RequestSummary` (see
 * `toSymptomScoresPayload` in `lib/symptoms.ts`).
 */
function SymptomIntensity() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DiagnosticDraftState | null;
  const questionnaireId = getOrCreateQuestionnaireId(state?.questionnaireId);
  const [scores, setScores] = useState(() =>
    getInitialScores(getDiagnosticDraft(questionnaireId).symptomScores ?? state?.symptomScores)
  );
  const enteredAtRef = useRef(now());

  // Kept in the draft so the scores are still there when the patient comes back to this step.
  useEffect(() => {
    saveDiagnosticDraft(questionnaireId, { symptomScores: scores });
  }, [questionnaireId, scores]);

  usePreRdvScreenView({
    screenId: 'symptoms',
    stepNumber: 4,
    screenType: 'scale',
    questionnaireId,
    hasIncomingState: Boolean(state),
  });

  function handleScoreChange(symptomId: string, value: number) {
    setScores(previous => ({ ...previous, [symptomId]: value }));
  }

  function handleBack() {
    navigate(-1);
  }

  function handleNext() {
    const ratedCount = Object.values(scores).filter(score => score > 0).length;

    analytics.track(AnalyticsEvent.AnswerPreRdvQuestion, {
      screen_id: 'symptoms',
      question_id: 'symptoms_eva',
      question_type: 'scale',
      answer_value: SYMPTOMS.map(symptom => `${symptom.id}:${scores[symptom.id]}`).join(','),
      answer_count: ratedCount,
      time_spent_sec: Math.round((now() - enteredAtRef.current) / 1000),
      questionnaire_id: questionnaireId,
    });

    const nextState: DiagnosticDraftState = {
      ...state,
      symptomScores: scores,
      questionnaireId,
    };
    navigate('/diagnostic/step-5', { state: nextState });
  }

  return (
    <div className="flex w-full flex-1 flex-col bg-white">
      <div className="flex flex-1 flex-col items-start px-8 pt-5 pb-28 lg:items-center lg:px-27 lg:pb-5">
        <div className="flex w-full flex-col gap-10 lg:w-124.5">
          <div className="flex w-full items-start gap-4">
            <div className="bg-secondary-50 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <MoonIcon size={20} fillColor="headingPrimary" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
                Vos symptômes
              </p>
              <p className="text-body-secondary text-sm leading-5">
                Notez l’intensité de chaque symptôme de 0 (absent) à 10 (insupportable).
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            {SYMPTOMS.map(symptom => (
              <Card key={symptom.id} className="rounded-xl p-6">
                <EvaSlider
                  title={symptom.title}
                  description={symptom.description}
                  value={scores[symptom.id] ?? 0}
                  onValueChange={value => handleScoreChange(symptom.id, value)}
                />
              </Card>
            ))}
          </div>

          <div className="hidden w-full items-center justify-between lg:flex">
            <Button
              type="button"
              variant="neutral"
              size="icon-xl"
              onClick={handleBack}
              aria-label="Retour"
            >
              <ArrowBackIcon className="size-6" />
            </Button>
            <Button type="button" size="xl" className="gap-6" onClick={handleNext}>
              Suivant
              <ArrowForwardIcon className="size-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 bg-white px-8 py-4 lg:hidden">
        <Button type="button" size="xl" className="w-full justify-between" onClick={handleNext}>
          Suivant
          <ArrowForwardIcon className="size-6" />
        </Button>
      </div>
    </div>
  );
}

export { SymptomIntensity };
