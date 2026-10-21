import { useEffect, useRef, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { WebHeader } from '@/components/layout';
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Checkbox,
} from '@/components/ui';
import { useAcceptGdpr, useGdprConsent, useSendCode } from '@/features/patient-auth/api';
import { GdprCard, MediaCard } from '@/features/patient-auth/components';
import { consumePostAuthRedirect } from '@/features/patient-auth/lib/post-auth-redirect';
import { CheckIcon, OvalPlusIcon, OvalUserIcon, ProtectedUserIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { AnalyticsEvent, analytics } from '@/services';

function getGdprStepIcon(step: number) {
  switch (step) {
    case 2:
      return <ProtectedUserIcon size={48} fillColor="headingPrimary" />;
    case 3:
      return <OvalPlusIcon size={48} fillColor="headingPrimary" />;
    default:
      return <OvalUserIcon size={48} fillColor="headingPrimary" />;
  }
}

export default function GdprScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    email?: string;
    alreadyAuthenticated?: boolean;
    type?: 'login' | 'signup';
    firstName?: string;
    lastName?: string;
  } | null;
  const email = state?.email;
  const alreadyAuthenticated = state?.alreadyAuthenticated ?? false;
  const type = state?.type ?? 'signup';

  const { data } = useGdprConsent(email);
  const { mutateAsync: sendCode, isPending: isSendingCode } = useSendCode();
  const { mutateAsync: acceptGdpr, isPending: isAccepting } = useAcceptGdpr();
  const isSubmitting = alreadyAuthenticated ? isAccepting : isSendingCode;

  const [acceptsData, setAcceptsData] = useState(false);
  const [acceptsTerms, setAcceptsTerms] = useState(false);

  function trackConsent(checkbox: 'data_processing' | 'terms', value: boolean) {
    analytics.track(AnalyticsEvent.GiveGdprConsent, {
      action: value ? 'check' : 'uncheck',
      checkbox,
      value,
    });
  }

  useEffect(() => {
    if (!email) navigate('/login', { replace: true });
  }, [email, navigate]);

  const hasTrackedOpenRef = useRef(false);
  useEffect(() => {
    if (!email || hasTrackedOpenRef.current) return;
    hasTrackedOpenRef.current = true;
    analytics.track(AnalyticsEvent.OpenOnboardingScreen, {
      screen_id: 'gdpr_consent',
      flow: 'account_creation',
      step_number: 1,
      screen_type: 'consent',
    });
  }, [email]);

  if (!email) return null;

  const slides = data?.data.gdpr ?? [];
  const canSubmit = acceptsData && acceptsTerms;

  async function handleSubmit() {
    if (!canSubmit || !email) return;
    if (alreadyAuthenticated) {
      try {
        const response = await acceptGdpr();
        console.log('[acceptGdpr] response:', response);
      } catch (error) {
        console.error('[acceptGdpr] error:', error);
        return;
      }
      const needsAccountSetup = !data?.data.user?.has_completed_onboarding;
      navigate(needsAccountSetup ? '/account/step-1' : consumePostAuthRedirect('/home'), {
        state: needsAccountSetup
          ? {
              email,
              userId: data?.data.user?.id,
              firstName: state?.firstName,
              lastName: state?.lastName,
            }
          : undefined,
        replace: true,
      });
      return;
    }
    await sendCode({ email, type });
    navigate('/otp', { state: { email, type } });
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <WebHeader />

      <div className="relative flex flex-1 flex-col items-start gap-0 px-0 py-8 lg:items-center lg:justify-center lg:gap-16 lg:px-27">
        {slides.length > 0 && (
          <div className="flex w-full flex-col lg:w-124.5">
            <Carousel opts={{ align: 'start' }}>
              <CarouselContent className="ml-5 gap-1 lg:ml-0 lg:gap-0">
                {slides.map((item, index) => (
                  <CarouselItem
                    key={item.step}
                    className={cn(
                      'basis-85 lg:basis-full',
                      index === slides.length - 1 && 'mr-5 lg:mr-0'
                    )}
                  >
                    {item.media ? (
                      <MediaCard
                        src={item.media}
                        index={index}
                        className="h-108 w-85 lg:h-98 lg:w-124.5"
                      />
                    ) : (
                      <GdprCard
                        icon={getGdprStepIcon(item.step)}
                        title={item.title ?? ''}
                        paragraphs={item.paragraphs ?? []}
                        backgroundColor={item.backgroundColor}
                      />
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-6 flex items-center justify-center lg:mt-2 lg:justify-between">
                <CarouselPrevious className="hidden lg:flex" />
                <CarouselDots />
                <CarouselNext className="hidden lg:flex" />
              </div>
            </Carousel>
          </div>
        )}

        <div className="flex w-full flex-col items-start gap-6 px-8 pt-10 pb-8 lg:w-124.5 lg:px-0 lg:pt-0 lg:pb-0">
          <div className="flex w-full flex-col gap-2">
            <Checkbox
              label="J’accepte le traitement de mes données personnelles et de santé."
              checked={acceptsData}
              onChange={event => {
                setAcceptsData(event.target.checked);
                trackConsent('data_processing', event.target.checked);
              }}
            />
            <Checkbox
              label={
                <>
                  J’accepte les <span className="underline">CGU</span> et la{' '}
                  <span className="underline">politique de confidentialité</span>
                </>
              }
              checked={acceptsTerms}
              onChange={event => {
                setAcceptsTerms(event.target.checked);
                trackConsent('terms', event.target.checked);
              }}
            />
          </div>

          <Button
            size="xl"
            className="w-full justify-between"
            disabled={!canSubmit}
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Valider
            <CheckIcon className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
