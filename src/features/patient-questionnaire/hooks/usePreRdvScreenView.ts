import { useEffect, useRef } from 'react';

import { useNavigationType } from 'react-router-dom';

import { AnalyticsEvent, analytics } from '@/services';
import type { PreRdvScreenId, PreRdvScreenType } from '@/services';

interface UsePreRdvScreenViewParams {
  screenId: PreRdvScreenId;
  stepNumber: number;
  screenType: PreRdvScreenType;
  questionnaireId: string;
  /**
   * Whether route state was present on this mount — i.e. the patient arrived from elsewhere
   * in the flow rather than hitting this URL fresh. Distinguishes `backward` (a `POP`
   * navigation with state present — covers both the "Retour" button, since `navigate(-1)` is
   * itself a `POP`, and the browser's own back/forward buttons) from `direct` (`POP` with no
   * state — a reload or a pasted/bookmarked link).
   */
  hasIncomingState: boolean;
}

/**
 * Fires `OPEN_PRE_RDV_SCREEN` once per screen mount. `navigation_direction` is derived from
 * React Router's own navigation type rather than guessed: `PUSH` is an explicit forward
 * `navigate(path, { state })` call (Suivant/Commencer); `POP` is everything above.
 */
export function usePreRdvScreenView({
  screenId,
  stepNumber,
  screenType,
  questionnaireId,
  hasIncomingState,
}: UsePreRdvScreenViewParams) {
  const navigationType = useNavigationType();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) return;
    hasTrackedRef.current = true;

    analytics.track(AnalyticsEvent.OpenPreRdvScreen, {
      screen_id: screenId,
      step_number: stepNumber,
      screen_type: screenType,
      navigation_direction:
        navigationType === 'PUSH' ? 'forward' : hasIncomingState ? 'backward' : 'direct',
      questionnaire_id: questionnaireId,
    });
    // Fire once per mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
