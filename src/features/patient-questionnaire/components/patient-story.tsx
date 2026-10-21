import { useEffect, useRef, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Textarea } from '@/components/ui';
import { usePreRdvScreenView } from '@/features/patient-questionnaire/hooks';
import { getOrCreateQuestionnaireId } from '@/features/patient-questionnaire/lib/analytics';
import {
  getDiagnosticDraft,
  saveDiagnosticDraft,
} from '@/features/patient-questionnaire/lib/diagnostic-draft';
import type { DiagnosticDraftState } from '@/features/patient-questionnaire/types';
import useSpeechToText from '@/hooks/useSpeechToText';
import { ArrowBackIcon, ArrowForwardIcon, MicIcon, MoonIcon, StopCircleIcon } from '@/icons';
import { now } from '@/lib/time';
import { cn } from '@/lib/utils';
import { AnalyticsEvent, analytics } from '@/services';

/**
 * "step 2" (Figma node 6527:4996, plus its "form filled" state — node 6527:5038) — free-text
 * patient story, second step of the new structured `/diagnostic/step-*` flow (after "flow /
 * step 1", the motif selection). No button-loading state on "Suivant" — it navigates
 * immediately once a story is typed, per direct user request to drop the placeholder loader.
 *
 * The mic button dictates into the textarea via `useSpeechToText` (browser-native Web Speech
 * API — no confirmed backend/cloud STT endpoint exists for this app). While listening, it
 * switches to Figma's "rec in progress" state (node 6678:22186): the same white pill button
 * widens to show a stop-circle icon plus an "Arrêter" label instead of the bare mic glyph.
 * The disabled state on unsupported browsers (Firefox) is still a judgment call, not derived
 * from the design.
 *
 * `dictationError` (added 2026-09-09, not in Figma) surfaces a fatal `useSpeechToText` failure
 * — mainly a refused/blocked mic session, which on a real phone testing over plain http almost
 * always means the page isn't a secure origin (see the hook's own doc comment) — as inline text
 * using the same `text-form-field-text-errored` pattern as `RequestSummary`'s submit error,
 * instead of leaving the mic button looking unresponsive with no explanation.
 */
function PatientStory() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DiagnosticDraftState | null;
  const questionnaireId = getOrCreateQuestionnaireId(state?.questionnaireId);
  const [initialDraft] = useState(() => getDiagnosticDraft(questionnaireId));
  const [story, setStory] = useState(initialDraft.story ?? state?.story ?? '');
  const enteredAtRef = useRef(now());
  // Restored from the draft so coming back to this step doesn't reset `story_input_method`.
  const restoredInputMethod = initialDraft.storyInputMethod ?? state?.storyInputMethod;
  const usedVoiceRef = useRef(restoredInputMethod === 'voice' || restoredInputMethod === 'mixed');
  const usedTypingRef = useRef(restoredInputMethod === 'text' || restoredInputMethod === 'mixed');
  const listeningStartedAtRef = useRef<number | null>(null);
  const wasListeningRef = useRef(false);

  usePreRdvScreenView({
    screenId: 'story',
    stepNumber: 3,
    screenType: 'free_text',
    questionnaireId,
    hasIncomingState: Boolean(state),
  });

  const {
    isSupported: isDictationSupported,
    isListening,
    toggle: toggleDictation,
    error: dictationError,
  } = useSpeechToText({
    lang: 'fr-FR',
    onResult: transcript => {
      usedVoiceRef.current = true;
      setStory(previous => {
        const trimmedPrevious = previous.trim();
        return trimmedPrevious ? `${trimmedPrevious} ${transcript}` : transcript;
      });
    },
  });

  // Tracks `START_VOICE_INPUT`/`STOP_VOICE_INPUT` off `isListening` transitions rather than
  // wrapping the mic button's own click handler, so a session that ends on its own (a fatal
  // `onerror` inside `useSpeechToText`, not just a manual stop tap) is still tracked.
  useEffect(() => {
    if (isListening && !wasListeningRef.current) {
      listeningStartedAtRef.current = now();
      analytics.track(AnalyticsEvent.StartVoiceInput, {
        screen_id: 'story',
        questionnaire_id: questionnaireId,
      });
    } else if (!isListening && wasListeningRef.current) {
      const startedAt = listeningStartedAtRef.current;
      analytics.track(AnalyticsEvent.StopVoiceInput, {
        screen_id: 'story',
        duration_sec: startedAt ? Math.round((now() - startedAt) / 1000) : 0,
        status: dictationError ? 'error' : 'success',
        questionnaire_id: questionnaireId,
      });
    }
    wasListeningRef.current = isListening;
  }, [isListening, dictationError, questionnaireId]);

  // Kept in the draft so the text is still there when the patient comes back to this step.
  useEffect(() => {
    saveDiagnosticDraft(questionnaireId, { story });
  }, [questionnaireId, story]);

  const hasStory = story.trim().length > 0;

  function handleBack() {
    navigate(-1);
  }

  function handleNext() {
    if (!hasStory) return;

    const inputMethod =
      usedVoiceRef.current && usedTypingRef.current
        ? 'mixed'
        : usedVoiceRef.current
          ? 'voice'
          : usedTypingRef.current
            ? 'text'
            : 'none';
    saveDiagnosticDraft(questionnaireId, { storyInputMethod: inputMethod });

    analytics.track(AnalyticsEvent.AnswerPreRdvQuestion, {
      screen_id: 'story',
      question_id: 'story',
      question_type: 'free_text',
      // Never the free-text content itself — a length proxy only, per the tracking plan.
      text_length: story.trim().length,
      input_method: inputMethod,
      time_spent_sec: Math.round((now() - enteredAtRef.current) / 1000),
      questionnaire_id: questionnaireId,
    });

    const nextState: DiagnosticDraftState = {
      ...state,
      story: story.trim(),
      questionnaireId,
      storyInputMethod: inputMethod,
    };
    navigate('/diagnostic/step-4', { state: nextState });
  }

  return (
    <div className="flex w-full flex-1 flex-col bg-white">
      <div className="flex flex-1 flex-col items-start px-8 pt-4 pb-28 lg:items-center lg:px-27">
        <div className="flex w-full flex-col gap-10 lg:w-124.5">
          <div className="flex w-full items-start gap-4">
            <div className="bg-secondary-50 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <MoonIcon size={20} fillColor="headingPrimary" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
                Racontez votre histoire
              </p>
              <p className="text-body-secondary text-sm leading-5">
                Vous pouvez écrire ou dicter, à votre rythme, comme si vous parliez à votre médecin.
                N’hésitez pas à être précise : même un détail qui vous semble anodin peut nous être
                utile.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Textarea
              placeholder="Depuis quand ? Où avez-vous mal ? À quelle fréquence ? Avec quelle intensité ? Qu’est-ce qui déclenche ou soulage vos symptômes ? Quels examens, diagnostics ou traitements avez-vous déjà eus ?"
              value={story}
              onChange={event => {
                usedTypingRef.current = true;
                setStory(event.target.value);
              }}
            >
              <div className="flex w-full items-center px-6 pt-4 pb-3">
                <Button
                  type="button"
                  variant="white"
                  size="icon-button"
                  disabled={!isDictationSupported}
                  aria-label={isListening ? 'Arrêter la dictée' : 'Dicter le message'}
                  aria-pressed={isListening}
                  title={
                    isDictationSupported
                      ? undefined
                      : "La dictée vocale n'est pas disponible sur ce navigateur"
                  }
                  className={cn(isListening && 'gap-4 font-bold')}
                  onClick={toggleDictation}
                >
                  {isListening ? (
                    <>
                      <StopCircleIcon className="size-6" />
                      Arrêter
                    </>
                  ) : (
                    <MicIcon size={24} fillColor="headingPrimary" className="size-6" />
                  )}
                </Button>
              </div>
            </Textarea>
            {dictationError && (
              <p className="text-form-field-text-errored text-sm font-medium">{dictationError}</p>
            )}
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
              disabled={!hasStory}
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
          disabled={!hasStory}
          onClick={handleNext}
        >
          Suivant
          <ArrowForwardIcon className="size-6" />
        </Button>
      </div>
    </div>
  );
}

export { PatientStory };
