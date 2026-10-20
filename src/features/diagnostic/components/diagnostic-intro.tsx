import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui';
import { usePreRdvScreenView } from '@/features/diagnostic/hooks';
import { getOrCreateQuestionnaireId } from '@/features/diagnostic/lib/analytics';
import type { DiagnosticDraftState } from '@/features/diagnostic/types';
import { ArrowForwardIcon, MedicalFolderIcon } from '@/icons';
import { now } from '@/lib/time';
import { AnalyticsEvent, analytics } from '@/services';

/**
 * This component is shared by two routes — `/diagnostic/intro` (right after account
 * creation, via `DiagnosticIntroScreen`) and `/dossier` (an existing patient starting a new
 * pre-appointment questionnaire from the main nav) — so `entry_point` is derived from which
 * one rendered it rather than hardcoded. Neither an email/SMS deep link nor a centre QR code
 * is wired up in this app yet, so `email_link` / `sms` / `centre_qr` (the tracking plan's
 * other example values) aren't reachable here yet.
 */
function getEntryPoint(pathname: string) {
  return pathname === '/dossier' ? 'dossier_nav' : 'account_creation_end';
}

function DiagnosticIntro() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DiagnosticDraftState | null;
  const questionnaireId = getOrCreateQuestionnaireId(state?.questionnaireId);

  usePreRdvScreenView({
    screenId: 'intro',
    stepNumber: 1,
    screenType: 'intro',
    questionnaireId,
    hasIncomingState: Boolean(state),
  });

  function handleStart() {
    const startedAt = now();
    analytics.track(AnalyticsEvent.StartPreRdvQuestionnaire, {
      entry_point: getEntryPoint(location.pathname),
      questionnaire_id: questionnaireId,
    });
    const nextState: DiagnosticDraftState = {
      ...state,
      questionnaireId,
      questionnaireStartedAt: startedAt,
    };
    navigate('/diagnostic/step-2', { state: nextState });
  }

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-white">
      <div className="flex flex-1 flex-col items-start px-8 pt-4 pb-44 lg:items-center lg:px-27">
        <div className="flex w-full flex-col items-start gap-10 lg:w-124.5">
          <div className="flex w-full flex-col items-start gap-8">
            <div className="bg-primary-10 flex h-49 w-full items-center justify-center rounded-2xl px-6">
              <MedicalFolderIcon size={80} color="headingPrimary" />
            </div>

            <div className="flex w-full flex-col items-start gap-4">
              <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
                Préparez votre rendez-vous
              </p>
              <div className="text-body-secondary flex w-full flex-col text-sm leading-5">
                <p className="mb-7">
                  Ce questionnaire nous aide à mieux comprendre votre situation avant votre
                  rendez-vous : votre histoire, vos symptômes, vos traitements ou les documents
                  médicaux dont vous disposez.
                </p>
                <p className="mb-7 font-bold">
                  Vos réponses sont lues par l’équipe Luna afin de vous orienter vers le ou la
                  praticien·ne le plus adapté·e et de préparer au mieux votre première consultation.
                </p>
                <p>
                  Répondez à votre rythme et avec vos mots : plus vous nous donnez de détails, plus
                  nous pourrons bien comprendre votre situation (il n&apos;y a pas de bonne ou de
                  mauvaise réponse)
                </p>
              </div>
            </div>
          </div>

          <div className="hidden w-full flex-col items-end lg:flex">
            <Button size="xl" onClick={handleStart}>
              Commencer
              <ArrowForwardIcon className="size-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 flex flex-col gap-4 bg-white px-8 py-4 lg:hidden">
        <Button size="xl" className="w-full justify-between" onClick={handleStart}>
          Commencer
          <ArrowForwardIcon className="size-6" />
        </Button>
      </div>
    </div>
  );
}

export { DiagnosticIntro };
