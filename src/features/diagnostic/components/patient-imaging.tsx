import { useEffect, useRef, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Option } from '@/components/ui';
import { usePreRdvScreenView } from '@/features/diagnostic/hooks';
import { getOrCreateQuestionnaireId } from '@/features/diagnostic/lib/analytics';
import {
  getDiagnosticDraft,
  saveDiagnosticDraft,
} from '@/features/diagnostic/lib/diagnostic-draft';
import type { DiagnosticDraftState } from '@/features/diagnostic/types';
import { ArrowBackIcon, ArrowForwardIcon, MoonIcon } from '@/icons';
import { now } from '@/lib/time';
import { AnalyticsEvent, analytics } from '@/services';

/**
 * "step 3A / open question" (Figma node 7371:4645) — routed at `/diagnostic/step-5`, between
 * the symptoms EVA screen (`/diagnostic/step-4`, "Étape 3/4") and document upload
 * (`/diagnostic/step-6`). It's sub-step A of the last step, document upload is sub-step B —
 * both share the "Étape 4/4" label (the flow became 4 steps when the symptoms screen was
 * added on 2026-10-01). Asks whether the
 * patient has an échographie/IRM dated less than 12 months. A single yes/no
 * `Option` pair — reuses the DS `Option` primitive (`components/ui/option-list.tsx`) as-is,
 * its selected/unselected classes are already a pixel match for this exact Figma component
 * (`bg-option-list-background-selected` + `border-option-list-border-selected` + `pr-16` when
 * selected, `pr-40` otherwise), so no new styling was needed for the options themselves.
 *
 * "Suivant" stays disabled until the patient picks either answer, same pattern as step 1
 * (`ConsultationReason`) requiring at least one selection. The answer is threaded through
 * `DiagnosticDraftState.hasRecentImaging` and sent to `POST /consultation-requests` as `has_mri`.
 */
function PatientImaging() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DiagnosticDraftState | null;
  const questionnaireId = getOrCreateQuestionnaireId(state?.questionnaireId);
  const [hasRecentImaging, setHasRecentImaging] = useState<boolean | undefined>(
    () => getDiagnosticDraft(questionnaireId).hasRecentImaging ?? state?.hasRecentImaging
  );
  const enteredAtRef = useRef(now());

  // Kept in the draft so the answer is still there when the patient comes back to this step.
  useEffect(() => {
    if (hasRecentImaging === undefined) return;
    saveDiagnosticDraft(questionnaireId, { hasRecentImaging });
  }, [questionnaireId, hasRecentImaging]);

  usePreRdvScreenView({
    screenId: 'imaging_recent',
    stepNumber: 5,
    screenType: 'single_select',
    questionnaireId,
    hasIncomingState: Boolean(state),
  });

  const hasAnswer = hasRecentImaging !== undefined;

  function handleBack() {
    navigate(-1);
  }

  function handleNext() {
    if (!hasAnswer) return;

    analytics.track(AnalyticsEvent.AnswerPreRdvQuestion, {
      screen_id: 'imaging_recent',
      question_id: 'imaging_recent',
      question_type: 'single_select',
      answer_value: hasRecentImaging ? 'yes' : 'no',
      time_spent_sec: Math.round((now() - enteredAtRef.current) / 1000),
      questionnaire_id: questionnaireId,
    });

    const nextState: DiagnosticDraftState = { ...state, hasRecentImaging, questionnaireId };
    navigate('/diagnostic/step-6', { state: nextState });
  }

  return (
    <div className="flex w-full flex-1 flex-col bg-white">
      <div className="flex flex-1 flex-col items-start px-8 pt-5 pb-28 lg:items-center lg:px-27">
        <div className="flex w-full flex-col gap-10 lg:w-124.5">
          <div className="flex w-full items-start gap-4">
            <div className="bg-secondary-50 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <MoonIcon size={20} fillColor="headingPrimary" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
                Avez-vous une échographie ou une IRM datant de moins de 12 mois ?
              </p>
              <div className="text-body-secondary flex flex-col gap-2 text-sm leading-5">
                <p>Cette information nous aide à préparer votre orientation.</p>
                <p>Vous pouvez nous transmettre vos documents à l’étape suivante.</p>
              </div>
            </div>
          </div>

          {/* Mobile-vs-desktop layout fix (2026-09-09): Figma stacks Oui/Non as full-width
              rows on mobile (node 7371:4495, "list" is a `flex-col gap-8` — one option per
              row) and only puts them side by side from the desktop frame up (node 7371:4645,
              a `flex` row with `flex-1` on each Option). The old code used `grid-cols-2`
              unconditionally, so on a mobile-width viewport each column was too narrow for
              the Option's own horizontal padding, pushing the "Oui"/"Non" label out of view
              entirely — not just visually cramped, actually invisible. `lg:grid` restores the
              original equal-width-columns fix (`grid-cols-2` compiles to
              `repeat(2, minmax(0, 1fr))`, so neither column can be pushed around by the
              selected option's different padding — see the Option padding fix in
              `option-list.tsx` for why that padding difference existed at all) but only once
              there's room for it; the mobile base case is a plain vertical stack, matching
              Figma. */}
          <div className="flex w-full flex-col gap-2 lg:grid lg:grid-cols-2">
            <Option
              label="Oui"
              selected={hasRecentImaging === true}
              onClick={() => setHasRecentImaging(true)}
            />
            <Option
              label="Non"
              selected={hasRecentImaging === false}
              onClick={() => setHasRecentImaging(false)}
            />
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
              disabled={!hasAnswer}
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
          disabled={!hasAnswer}
          onClick={handleNext}
        >
          Suivant
          <ArrowForwardIcon className="size-6" />
        </Button>
      </div>
    </div>
  );
}

export { PatientImaging };
