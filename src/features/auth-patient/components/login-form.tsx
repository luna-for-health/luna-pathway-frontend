import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button, Input, SSOButton } from '@/components/ui';
import { useCheckGdprConsent, useSendCode, useSignupWithOauth } from '@/features/auth-patient/api';
import { consumePostAuthRedirect } from '@/features/auth-patient/lib/post-auth-redirect';
import { loginSchema, type LoginFormValues } from '@/features/auth-patient/schemas';
import { signInWithApple, signInWithGoogle } from '@/features/auth-patient/services';
import type { LoginFormProps } from '@/features/auth-patient/types';
import { ArrowForwardIcon, MailIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { AnalyticsEvent, analytics, ApiError, tokenStorage } from '@/services';

function LoginForm({ className }: LoginFormProps) {
  const navigate = useNavigate();
  const { mutateAsync: checkGdprConsent, isPending: isCheckingConsent } = useCheckGdprConsent();
  const { mutateAsync: sendCode, isPending: isSendingCode } = useSendCode();
  const { mutateAsync: signupWithOauth } = useSignupWithOauth();
  const isPending = isCheckingConsent || isSendingCode;

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string>();
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [appleError, setAppleError] = useState<string>();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitted },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  function getErrorMessage(error: unknown) {
    if (error instanceof ApiError) return error.response?.message ?? 'Une erreur est survenue.';
    if (error instanceof Error) return error.message;
    return 'Une erreur est survenue.';
  }

  async function submit({ email }: LoginFormValues) {
    try {
      const consent = await checkGdprConsent(email);
      const type: 'login' | 'signup' = consent.data.user ? 'login' : 'signup';

      if (!consent.data.user?.has_accepted_gdpr) {
        navigate('/gdpr', { state: { email, type } });
        return;
      }

      await sendCode({ email, type });
      navigate('/otp', { state: { email, type } });
    } catch (error) {
      setError('email', { message: getErrorMessage(error) });
    }
  }

  async function handleGoogleSignIn() {
    setGoogleError(undefined);
    setIsGoogleLoading(true);
    try {
      const { accessToken, firstName, lastName } = await signInWithGoogle();
      const locale = navigator.language.split('-')[0] || 'fr';
      const response = await signupWithOauth({
        provider: 'google',
        payload: { access_token: accessToken, locale, first_name: firstName, last_name: lastName },
      });
      tokenStorage.set(response.data.access_token, 'patient');
      analytics.identify(response.data.user.id);
      analytics.track(AnalyticsEvent.SubmitAuthentication, {});

      // Prefer the backend's persisted name if it already has one (e.g. a returning
      // account), falling back to whatever Google's userinfo endpoint gave us this time.
      const nameState = {
        email: response.data.user.email,
        userId: response.data.user.id,
        firstName: response.data.user.first_name ?? firstName,
        lastName: response.data.user.last_name ?? lastName,
      };

      if (!response.data.user.has_accepted_gdpr) {
        navigate('/gdpr', {
          state: { alreadyAuthenticated: true, ...nameState },
          replace: true,
        });
        return;
      }
      navigate(
        response.data.user.has_completed_onboarding
          ? consumePostAuthRedirect('/diagnostic/intro')
          : '/account/step-1',
        {
          state: response.data.user.has_completed_onboarding ? undefined : nameState,
          replace: true,
        }
      );
    } catch (error) {
      setGoogleError(getErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handleAppleSignIn() {
    setAppleError(undefined);
    setIsAppleLoading(true);
    try {
      const { idToken, firstName, lastName } = await signInWithApple();
      const locale = navigator.language.split('-')[0] || 'fr';
      const response = await signupWithOauth({
        provider: 'apple',
        payload: { access_token: idToken, locale, first_name: firstName, last_name: lastName },
      });
      tokenStorage.set(response.data.access_token, 'patient');
      analytics.identify(response.data.user.id);
      analytics.track(AnalyticsEvent.SubmitAuthentication, {});

      // Apple only ever sends a name on someone's very first authorization (see
      // `signInWithApple`'s doc comment) — the backend's persisted name covers every
      // sign-in after that, so prefer it and fall back to what Apple gave us this time.
      const nameState = {
        email: response.data.user.email,
        userId: response.data.user.id,
        firstName: response.data.user.first_name ?? firstName,
        lastName: response.data.user.last_name ?? lastName,
      };

      if (!response.data.user.has_accepted_gdpr) {
        navigate('/gdpr', {
          state: { alreadyAuthenticated: true, ...nameState },
          replace: true,
        });
        return;
      }
      navigate(
        response.data.user.has_completed_onboarding
          ? consumePostAuthRedirect('/diagnostic/intro')
          : '/account/step-1',
        {
          state: response.data.user.has_completed_onboarding ? undefined : nameState,
          replace: true,
        }
      );
    } catch (error) {
      setAppleError(getErrorMessage(error));
    } finally {
      setIsAppleLoading(false);
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-10 lg:w-82.5', className)}>
      <p className="text-body-primary text-center text-sm lg:text-left">
        Utilisez votre adresse e-mail pour vous connecter ou créer votre compte.
      </p>

      <form onSubmit={handleSubmit(submit)} className="flex w-full flex-col gap-2">
        <Input
          label="Votre e-mail"
          icon={<MailIcon fillColor="formFieldIcon" />}
          placeholder="luna@gmail.com"
          error={isSubmitted ? errors.email?.message : undefined}
          {...register('email')}
        />

        <Button
          type="submit"
          size="xl"
          className="justify-between"
          disabled={!isValid}
          loading={isPending}
        >
          Continuer
          <ArrowForwardIcon className="size-4" />
        </Button>
      </form>

      <div className="flex w-full flex-col gap-1">
        <SSOButton
          provider="google"
          onClick={handleGoogleSignIn}
          loading={isGoogleLoading}
          disabled={isGoogleLoading}
        />
        <SSOButton
          provider="apple"
          onClick={handleAppleSignIn}
          loading={isAppleLoading}
          disabled={isAppleLoading}
        />
      </div>

      {googleError && (
        <p className="text-form-field-text-errored text-center text-sm font-medium">
          {googleError}
        </p>
      )}
      {appleError && (
        <p className="text-form-field-text-errored text-center text-sm font-medium">{appleError}</p>
      )}
    </div>
  );
}

export { LoginForm };
