import { useRef, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Button, EvaScoreBar } from '@/components/ui';
import { useCreateConsultationRequest } from '@/features/patient-questionnaire/api';
import { SummaryAnswer } from '@/features/patient-questionnaire/components/summary-answer';
import { usePreRdvScreenView } from '@/features/patient-questionnaire/hooks';
import { getOrCreateQuestionnaireId } from '@/features/patient-questionnaire/lib/analytics';
import { CONSULTATION_REASONS } from '@/features/patient-questionnaire/lib/consultation-reasons';
import { clearDiagnosticDraft } from '@/features/patient-questionnaire/lib/diagnostic-draft';
import { markJustSubmitted } from '@/features/patient-questionnaire/lib/submission-flag';
import { SYMPTOMS, toSymptomScoresPayload } from '@/features/patient-questionnaire/lib/symptoms';
import type { DiagnosticDraftState } from '@/features/patient-questionnaire/types';
import { ArrowBackIcon, CheckIcon } from '@/icons';
import { now } from '@/lib/time';
import { AnalyticsEvent, analytics, ApiError } from '@/services';

function RequestSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DiagnosticDraftState | null;
  const questionnaireId = getOrCreateQuestionnaireId(state?.questionnaireId);
  const { mutateAsync: createConsultationRequest, isPending } = useCreateConsultationRequest();
  const [submitError, setSubmitError] = useState<string>();
  const stepsCompletedRef = useRef(
    [
      state?.consultationReasons,
      state?.story,
      state?.symptomScores,
      state?.hasRecentImaging,
    ].filter(value => value !== undefined).length
  );

  usePreRdvScreenView({
    screenId: 'summary',
    stepNumber: 7,
    screenType: 'summary',
    questionnaireId,
    hasIncomingState: Boolean(state),
  });

  const consultationReasonLabels = (state?.consultationReasons ?? [])
    .map(id => CONSULTATION_REASONS.find(reason => reason.id === id)?.title)
    .filter((title): title is string => Boolean(title));

  // Figma annotation on the "Vos symptomes" row: "Only >0 sliders" — symptoms rated 0
  // ("absent") are left out of the recap. Kept in the EVA screen's order.
  const reportedSymptoms = SYMPTOMS.map(symptom => ({
    ...symptom,
    score: state?.symptomScores?.[symptom.id] ?? 0,
  })).filter(symptom => symptom.score > 0);

  const documentCount = state?.documents?.length ?? 0;
  const documentsSummary =
    documentCount === 0
      ? 'Aucun document joint.'
      : `${documentCount} document${documentCount > 1 ? 's' : ''} joint${documentCount > 1 ? 's' : ''}.`;

  function handleBack() {
    navigate(-1);
  }

  async function handleValidate() {
    if (isPending) return;
    setSubmitError(undefined);
    try {
      await createConsultationRequest({
        reason: consultationReasonLabels.join(', '),
        history: state?.story,
        ...toSymptomScoresPayload(state?.symptomScores),
        hasMri: state?.hasRecentImaging ?? false,
        documents: state?.documents,
      });

      const startedAt = state?.questionnaireStartedAt;
      analytics.track(AnalyticsEvent.SubmitPreRdvQuestionnaire, {
        time_to_complete_sec: startedAt ? Math.round((now() - startedAt) / 1000) : 0,
        steps_completed_count: stepsCompletedRef.current,
        documents_count: documentCount,
        story_input_method: state?.storyInputMethod ?? 'none',
        questionnaire_id: questionnaireId,
      });

      clearDiagnosticDraft();
      markJustSubmitted();
      navigate('/diagnostic/confirmation', { state: { questionnaireId } });
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? (err.response?.message ?? 'Une erreur est survenue, veuillez réessayer.')
          : 'Une erreur est survenue, veuillez réessayer.'
      );
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col bg-white">
      <div className="flex flex-1 flex-col items-start px-8 pt-5 pb-36 lg:items-center lg:px-27">
        <div className="flex w-full flex-col gap-10 lg:w-124.5">
          <div className="flex w-full flex-col gap-2">
            <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
              Validez votre demande
            </p>
            <p className="text-body-secondary text-sm leading-5">
              En validant, nous créons un document de synthèse clair et structuré, transmis au
              secrétariat et au médecin.
            </p>
          </div>

          <div className="border-card-border divide-card-border bg-neutral-white flex w-full flex-col items-start divide-y overflow-hidden rounded-2xl border">
            <SummaryAnswer title="Motif de consultation">
              {consultationReasonLabels.length > 0 ? consultationReasonLabels.join(', ') : '—'}
            </SummaryAnswer>
            <SummaryAnswer title="Votre histoire">{state?.story || '—'}</SummaryAnswer>
            <SummaryAnswer title="Vos symptômes">
              {reportedSymptoms.length > 0 ? (
                <ul className="flex w-full flex-col gap-4">
                  {reportedSymptoms.map(symptom => (
                    <li key={symptom.id} className="flex w-full items-center gap-2">
                      <span className="min-w-0 flex-1">{symptom.title}</span>
                      <EvaScoreBar value={symptom.score} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucun symptôme signalé.</p>
              )}
            </SummaryAnswer>
            <SummaryAnswer title="Vos documents">
              {/* Figma node 7251:12664's "documents" group adds this sentence above the
                  document count only when the patient answered "Oui" to the step-5
                  recent-imaging question (PatientImaging) — omitted for "Non"/unanswered,
                  same as before this question existed. */}
              {state?.hasRecentImaging && (
                <p>Vous avez une échographie ou une IRM de moins de 12 mois.</p>
              )}
              <p>{documentsSummary}</p>
            </SummaryAnswer>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 rounded-t-2xl bg-gradient-to-t from-white via-white/90 to-white/0 px-8 py-5">
        {submitError && (
          <p className="text-form-field-text-errored w-full text-center text-sm font-medium lg:w-124.5">
            {submitError}
          </p>
        )}
        <Button
          type="button"
          size="xl"
          className="w-full justify-between lg:hidden"
          loading={isPending}
          onClick={handleValidate}
        >
          Valider et envoyer
          <CheckIcon className="size-6" />
        </Button>

        <div className="hidden w-full items-center justify-between lg:flex lg:w-124.5">
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
            loading={isPending}
            onClick={handleValidate}
          >
            Valider et envoyer
            <CheckIcon className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { RequestSummary };
