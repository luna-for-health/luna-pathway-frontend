import { useEffect, useRef } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { getOrCreateQuestionnaireId } from '@/features/diagnostic/lib/analytics';
import { consumeJustSubmitted } from '@/features/diagnostic/lib/submission-flag';
import type { DiagnosticDraftState } from '@/features/diagnostic/types';
import { CircleScribbleIcon } from '@/icons';
import { AnalyticsEvent, analytics } from '@/services';

function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DiagnosticDraftState | null;

  // Guards against a reload or direct URL hit on this screen: `consumeJustSubmitted` is only
  // `true` once, right after a real post-submission navigation from `RequestSummary`. On a
  // reload the sessionStorage flag it checks is already gone (it was consumed on the first
  // mount), so the patient is sent back into the questionnaire flow instead of seeing a stale
  // confirmation message for a request that may not reflect their current draft.
  //
  // `hasCheckedRef` makes this resilient to StrictMode's dev-only double-invoke of mount
  // effects (mount → cleanup → mount again, same component instance): without it, the
  // second invocation would find the flag already consumed by the first and incorrectly
  // redirect away from a legitimate post-submit landing. The ref survives that simulated
  // remount (same fiber, only effects re-run) but is fresh on any real reload.
  //
  // `OPEN_PRE_RDV_SCREEN` (screen_id `success`) only fires on the genuine landing, not on the
  // reload/direct-hit path that's about to redirect away — an `OPEN_PRE_RDV_SCREEN` for a
  // screen the patient is immediately bounced off of isn't a real screen view.
  const hasCheckedRef = useRef(false);
  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;
    if (consumeJustSubmitted()) {
      analytics.track(AnalyticsEvent.OpenPreRdvScreen, {
        screen_id: 'success',
        step_number: 7,
        screen_type: 'confirmation',
        navigation_direction: 'forward',
        questionnaire_id: getOrCreateQuestionnaireId(state?.questionnaireId),
      });
    } else {
      navigate('/diagnostic/intro', { replace: true });
    }
  }, [navigate, state?.questionnaireId]);

  return (
    // py-4, not py-16: Figma's container-wrapper-center uses the spacing-16 token (16px) —
    // Tailwind's own pr-N/py-N scale is in units of 4px, so py-4 is 16px; py-16 (the earlier
    // code) is 64px, the same token-number-taken-literally mistake fixed in option-list.tsx's
    // Option padding (2026-09-09).
    //
    // pb-40, not pb-4 (2026-10-06 fix, Figma node 7380:5187): Figma's `container-wrapper-center`
    // is 728px tall (page height minus the 72px header) but starts at the TOP of the page, so the
    // content's center sits 36px ABOVE the viewport's center. Centering inside the flex-1 area
    // below the header put it 36px BELOW instead — 72px lower than the design. An extra 144px
    // (2 × header height) of bottom padding moves the centered content up by exactly 72px.
    <div className="flex w-full flex-1 flex-col items-center justify-center px-8 pt-4 pb-40 lg:px-27">
      <div className="flex w-full flex-col items-center gap-8 lg:w-124.5">
        <div className="bg-alert-success-bg flex items-center justify-center rounded-full p-6">
          <div className="text-alert-success-text relative flex size-12 items-center justify-center">
            <CircleScribbleIcon className="absolute inset-0 size-full" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
            <p>Merci,</p>
            <p>nous avons bien reçu votre demande 🌼</p>
          </div>
          <p className="text-body-secondary text-sm leading-5">
            Notre secrétariat prend le relais et revient vers vous pour organiser votre rendez-vous.
          </p>
        </div>
      </div>
    </div>
  );
}

export { Confirmation };
