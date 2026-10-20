import { useEffect, useRef } from 'react';

import { WebHeader } from '@/components/layout';
import { AnalyticsEvent, analytics } from '@/services';

import { AccountNameForm } from '../components';

export default function AccountStep1Screen() {
  const hasTrackedRef = useRef(false);
  useEffect(() => {
    if (hasTrackedRef.current) return;
    hasTrackedRef.current = true;
    analytics.track(AnalyticsEvent.OpenOnboardingScreen, {
      screen_id: 'signup_name',
      flow: 'account_creation',
      step_number: 2,
      screen_type: 'form',
    });
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <WebHeader />
      <div className="animate-in slide-in-from-right-8 fade-in flex flex-1 flex-col items-start px-8 pt-4 duration-300 lg:items-center lg:px-27">
        <div className="w-full lg:w-124.5">
          <AccountNameForm />
        </div>
      </div>
    </div>
  );
}
