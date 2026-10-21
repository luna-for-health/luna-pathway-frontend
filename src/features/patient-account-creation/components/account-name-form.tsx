import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Input } from '@/components/ui';
import {
  accountNameSchema,
  type AccountNameFormValues,
} from '@/features/patient-account-creation/schemas';
import type {
  AccountDraftState,
  AccountNameFormProps,
} from '@/features/patient-account-creation/types';
import { ArrowForwardIcon, MoonIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { AnalyticsEvent, analytics } from '@/services';

/**
 * When a person arrives here via Google/Apple sign-in, `location.state` may already carry
 * a `firstName`/`lastName` the provider gave us (see `LoginForm`'s OAuth handlers) — used
 * here as editable defaults so the person reviews/corrects their name instead of retyping
 * it from scratch. Never auto-submitted: they still have to press "Continuer" themselves.
 */
function AccountNameForm({ className }: AccountNameFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as AccountDraftState | null;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<AccountNameFormValues>({
    resolver: zodResolver(accountNameSchema),
    mode: 'onChange',
    defaultValues: { firstName: state?.firstName ?? '', lastName: state?.lastName ?? '' },
  });

  function submit(values: AccountNameFormValues) {
    analytics.track(AnalyticsEvent.CompleteProfileStep, { step: 'name', status: 'success' });
    navigate('/account/step-2', { state: { ...state, ...values } });
  }

  return (
    <div className={cn('flex w-full flex-col gap-10', className)}>
      <div className="flex w-full items-start gap-4">
        <div className="bg-secondary-50 flex size-8 shrink-0 items-center justify-center rounded-lg">
          <MoonIcon size={20} fillColor="headingPrimary" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
            Bienvenue sur Luna.
          </p>
          <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
            Comment vous appellez-vous ?
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-2 lg:flex-row">
          <div className="min-w-0 flex-1">
            <Input
              placeholder="Votre prénom"
              error={isSubmitted ? errors.firstName?.message : undefined}
              {...register('firstName')}
            />
          </div>
          <div className="min-w-0 flex-1">
            <Input
              placeholder="Votre nom de famille"
              error={isSubmitted ? errors.lastName?.message : undefined}
              {...register('lastName')}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-end">
          <Button
            type="submit"
            size="xl"
            disabled={!isValid}
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

export { AccountNameForm };
