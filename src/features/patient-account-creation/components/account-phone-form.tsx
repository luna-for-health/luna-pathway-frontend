import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Input } from '@/components/ui';
import { getRandomAvatar } from '@/features/patient-account-creation/lib/avatar';
import { toIsoDate } from '@/features/patient-account-creation/lib/date';
import { toRegisterLocation } from '@/features/patient-account-creation/lib/location';
import { formatPhoneInput, toE164FrenchPhone } from '@/features/patient-account-creation/lib/phone';
import {
  accountPhoneSchema,
  type AccountPhoneFormValues,
} from '@/features/patient-account-creation/schemas';
import type {
  AccountDraftState,
  AccountPhoneFormProps,
} from '@/features/patient-account-creation/types';
import { useRegister } from '@/features/patient-auth/api';
import { consumePostAuthRedirect } from '@/features/patient-auth/lib/post-auth-redirect';
import { ArrowForwardIcon, MoonIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { AnalyticsEvent, analytics, ApiError, tokenStorage } from '@/services';

function AccountPhoneForm({ className }: AccountPhoneFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as AccountDraftState | null;

  const { mutateAsync: registerAccount, isPending } = useRegister();
  const [submitError, setSubmitError] = useState<string>();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isSubmitted },
  } = useForm<AccountPhoneFormValues>({
    resolver: zodResolver(accountPhoneSchema),
    mode: 'onChange',
    defaultValues: { phone: '' },
  });

  const phoneValue = useWatch({ control, name: 'phone' });

  async function submit(values: AccountPhoneFormValues) {
    setSubmitError(undefined);
    try {
      const response = await registerAccount({
        user_id: state?.userId ?? 0,
        first_name: state?.firstName ?? '',
        last_name: state?.lastName ?? '',
        email: state?.email ?? '',
        phone: toE164FrenchPhone(values.phone),
        birthdate: toIsoDate(state?.birthdate ?? '') ?? '',
        location: toRegisterLocation(state?.location),
        avatar: getRandomAvatar(),
      });
      if (response.data.access_token) tokenStorage.set(response.data.access_token, 'patient');
      analytics.identify(response.data.user.id);
      analytics.track(AnalyticsEvent.CompleteProfileStep, {
        step: 'phone',
        status: 'success',
        avatar_set: true,
      });
      // Back to the page the patient opened before logging in, if any (see RequirePatientAuth).
      navigate(consumePostAuthRedirect('/diagnostic/intro'), {
        state: { ...state, phone: values.phone },
      });
    } catch (err) {
      analytics.track(AnalyticsEvent.CompleteProfileStep, { step: 'phone', status: 'error' });
      setSubmitError(
        err instanceof ApiError
          ? (err.response?.message ?? 'Une erreur est survenue, veuillez réessayer.')
          : 'Une erreur est survenue, veuillez réessayer.'
      );
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-10', className)}>
      <div className="flex w-full items-start gap-4">
        <div className="bg-secondary-50 flex size-8 shrink-0 items-center justify-center rounded-lg">
          <MoonIcon size={20} fillColor="headingPrimary" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
            A quel numéro pouvons nous vous joindre ?
          </p>
          <p className="text-body-secondary text-sm leading-5">
            Cette information est nécessaire pour nous permettre de vous proposer un rendez-vous.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} className="flex w-full flex-col gap-4">
        <Input
          {...register('phone')}
          value={phoneValue}
          onChange={event =>
            setValue('phone', formatPhoneInput(event.target.value), {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          placeholder="Ex. 06 23 45 67 89"
          inputMode="tel"
          error={isSubmitted ? errors.phone?.message : undefined}
        />

        {submitError && (
          <p className="text-form-field-text-errored text-center text-sm font-medium">
            {submitError}
          </p>
        )}

        <div className="flex w-full flex-col items-end">
          <Button
            type="submit"
            size="xl"
            disabled={!isValid || isPending}
            loading={isPending}
            className="w-full justify-between font-bold lg:w-auto"
          >
            Continuer
            <ArrowForwardIcon className="size-6" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export { AccountPhoneForm };
