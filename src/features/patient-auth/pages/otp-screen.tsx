import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { WebHeader } from '@/components/layout';
import { LoadingOverlay } from '@/components/ui';
import { useSendCode, useVerifyCode } from '@/features/patient-auth/api';
import { OtpInput } from '@/features/patient-auth/components';
import { consumePostAuthRedirect } from '@/features/patient-auth/lib/post-auth-redirect';
import { AnalyticsEvent, analytics, ApiError, tokenStorage } from '@/services';

const RESEND_DELAY = 30;

export default function OtpScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { email?: string; type?: 'login' | 'signup' } | null;
  const email = state?.email;
  const flowType = state?.type ?? 'login';

  const { mutateAsync: verifyCode, isPending: isVerifying } = useVerifyCode();
  const { mutateAsync: sendCode, isPending: isResending } = useSendCode();
  const isSubmitting = isVerifying;

  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [timer, setTimer] = useState(RESEND_DELAY);
  const canResend = timer <= 0;

  useEffect(() => {
    if (!email) navigate('/login', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(current => current - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  async function handleComplete(value: string) {
    if (!email) return;
    setError(undefined);
    try {
      const response = await verifyCode({ email, code: value });

      tokenStorage.set(response.data.access_token, 'patient');
      analytics.identify(response.data.user.id);
      analytics.track(AnalyticsEvent.SubmitAuthentication, {});

      if (!response.data.user.has_accepted_gdpr) {
        navigate('/gdpr', { state: { email, alreadyAuthenticated: true }, replace: true });
        return;
      }

      navigate(
        response.data.user.has_completed_onboarding
          ? consumePostAuthRedirect('/diagnostic/intro')
          : '/account/step-1',

        {
          state: response.data.user.has_completed_onboarding
            ? undefined
            : { email: response.data.user.email, userId: response.data.user.id },
          replace: true,
        }
      );
    } catch (err) {
      const message =
        err instanceof ApiError
          ? (err.response?.message ?? 'Code invalide, veuillez réessayer.')
          : 'Code invalide, veuillez réessayer.';
      setError(message);
    }
  }

  async function handleResend() {
    if (!email || !canResend) return;
    await sendCode({ email, type: flowType });
    setTimer(RESEND_DELAY);
  }

  if (!email) return null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <WebHeader onBack={() => navigate(-1)} />

      <div className="relative flex flex-1 flex-col items-start px-8 pt-8 lg:items-center lg:justify-center lg:px-27 lg:py-2">
        <div className="flex w-full flex-col items-start gap-10 lg:w-124.5 lg:items-center">
          <div className="flex w-full flex-col gap-3">
            <h1 className="text-body-primary font-heading text-2xl leading-7 font-medium tracking-[-0.24px] lg:text-3xl lg:tracking-[-0.16px]">
              Nous venons de vous envoyer un code
            </h1>
            <div className="text-body-secondary flex w-full flex-col gap-2 text-sm">
              <p>Code envoyé sur votre adresse {email}</p>
              <p>
                Ce code <span className="font-bold">unique</span> et{' '}
                <span className="font-bold">sécurisé</span> vous permet de valider votre compte et
                de vous connecter.
              </p>
            </div>
          </div>

          <OtpInput
            value={code}
            onChange={setCode}
            onComplete={handleComplete}
            error={error}
            onErrorTimeout={() => setError(undefined)}
            disabled={isSubmitting}
            autoFocus
          />

          <div className="flex h-15 w-full items-center justify-center px-2 py-4">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-heading-primary text-sm font-medium underline disabled:opacity-50"
              >
                {isResending ? 'Renvoi...' : 'Renvoyer le code'}
              </button>
            ) : (
              <p className="text-form-field-placeholder text-sm">
                Renvoyer le code dans 00:{timer < 10 ? `0${timer}` : timer}
              </p>
            )}
          </div>

          <LoadingOverlay visible={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
