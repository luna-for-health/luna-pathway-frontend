import { useEffect, useRef, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui';
import { usePreRdvScreenView } from '@/features/patient-questionnaire/hooks';
import { getOrCreateQuestionnaireId } from '@/features/patient-questionnaire/lib/analytics';
import { CONSULTATION_REASONS } from '@/features/patient-questionnaire/lib/consultation-reasons';
import {
  getDiagnosticDraft,
  saveDiagnosticDraft,
} from '@/features/patient-questionnaire/lib/diagnostic-draft';
import type { DiagnosticDraftState } from '@/features/patient-questionnaire/types';
import { ArrowBackIcon, ArrowForwardIcon, MoonIcon } from '@/icons';
import { now } from '@/lib/time';
import { AnalyticsEvent, analytics, CONSULTATION_REASON_TRACKING_KEY } from '@/services';

import { ConsultationReasonOption } from './consultation-reason-option';

function ConsultationReason() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DiagnosticDraftState | null;
  const questionnaireId = getOrCreateQuestionnaireId(state?.questionnaireId);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () =>
      getDiagnosticDraft(questionnaireId).consultationReasons ?? state?.consultationReasons ?? []
  );
  const enteredAtRef = useRef(now());

  // Kept in the draft so the selection is still there when the patient comes back to this step.
  useEffect(() => {
    saveDiagnosticDraft(questionnaireId, { consultationReasons: selectedIds });
  }, [questionnaireId, selectedIds]);

  usePreRdvScreenView({
    screenId: 'reason',
    stepNumber: 2,
    // The plan's `screen_type` enum has no `multi_select` value (only `question_type` does) —
    // `single_select` is the closest fit it offers for this screen.
    screenType: 'single_select',
    questionnaireId,
    hasIncomingState: Boolean(state),
  });

  function toggleReason(id: string) {
    setSelectedIds(current =>
      current.includes(id) ? current.filter(value => value !== id) : [...current, id]
    );
  }

  function handleBack() {
    navigate(-1);
  }

  const hasSelection = selectedIds.length > 0;

  function handleNext() {
    if (!hasSelection) return;

    analytics.track(AnalyticsEvent.AnswerPreRdvQuestion, {
      screen_id: 'reason',
      question_id: 'reason_main',
      question_type: 'multi_select',
      answer_value: selectedIds.map(id => CONSULTATION_REASON_TRACKING_KEY[id] ?? id).join(','),
      answer_count: selectedIds.length,
      time_spent_sec: Math.round((now() - enteredAtRef.current) / 1000),
      questionnaire_id: questionnaireId,
    });

    const nextState: DiagnosticDraftState = {
      ...state,
      consultationReasons: selectedIds,
      questionnaireId,
    };
    navigate('/diagnostic/step-3', { state: nextState });
  }

  return (
    <div className="flex w-full flex-1 flex-col bg-white">
      <div className="flex flex-1 flex-col items-start px-8 pt-8 pb-28 lg:items-center lg:px-27">
        <div className="flex w-full flex-col gap-10 lg:w-124.5">
          <div className="flex w-full items-start gap-4">
            <div className="bg-secondary-50 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <MoonIcon size={20} fillColor="headingPrimary" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
                Pour commencer : quel est votre motif de consultation ?
              </p>
              <p className="text-body-secondary text-sm leading-5">
                Vous pouvez choisir plusieurs motifs, cela nous permet de vous orienter vers le bon
                professionnel.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            {CONSULTATION_REASONS.map(reason => (
              <ConsultationReasonOption
                key={reason.id}
                title={reason.title}
                description={reason.description}
                selected={selectedIds.includes(reason.id)}
                onClick={() => toggleReason(reason.id)}
              />
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
            <Button
              type="button"
              size="xl"
              className="gap-6"
              disabled={!hasSelection}
              onClick={handleNext}
            >
              Suivant
              <ArrowForwardIcon className="size-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 bg-white px-8 py-4 lg:hidden">
        <Button
          type="button"
          size="xl"
          className="w-full justify-between"
          disabled={!hasSelection}
          onClick={handleNext}
        >
          Suivant
          <ArrowForwardIcon className="size-6" />
        </Button>
      </div>
    </div>
  );
}

export { ConsultationReason };
