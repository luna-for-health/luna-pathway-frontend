import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Input } from '@/components/ui';
import { formatDateInput } from '@/features/account/lib/date';
import {
  accountBirthdateSchema,
  type AccountBirthdateFormValues,
} from '@/features/account/schemas';
import type { AccountBirthdateFormProps, AccountDraftState } from '@/features/account/types';
import { ArrowForwardIcon, MoonIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { AnalyticsEvent, analytics } from '@/services';

function AccountBirthdateForm({ className }: AccountBirthdateFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as AccountDraftState | null;
  const firstName = state?.firstName;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isSubmitted },
  } = useForm<AccountBirthdateFormValues>({
    resolver: zodResolver(accountBirthdateSchema),
    mode: 'onChange',
    defaultValues: { birthdate: '' },
  });

  const birthdateValue = useWatch({ control, name: 'birthdate' });

  function submit(values: AccountBirthdateFormValues) {
    analytics.track(AnalyticsEvent.CompleteProfileStep, { step: 'birthdate', status: 'success' });
    navigate('/account/step-3', { state: { ...state, birthdate: values.birthdate } });
  }

  return (
    <div className={cn('flex w-full flex-col gap-10', className)}>
      <div className="flex w-full items-start gap-4">
        <div className="bg-secondary-50 flex size-8 shrink-0 items-center justify-center rounded-lg">
          <MoonIcon size={20} fillColor="headingPrimary" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
            {firstName ? `Enchantée ${firstName} !` : 'Enchantée !'}
          </p>
          <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
            Quel est votre date de naissance ?
          </p>
          <p className="text-body-secondary text-sm leading-5">
            Cette information permet de compléter votre dossier médical.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} className="flex w-full flex-col gap-4">
        <Input
          {...register('birthdate')}
          value={birthdateValue}
          onChange={event =>
            setValue('birthdate', formatDateInput(event.target.value), {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          placeholder="JJ/MM/AAAA (ex. 01/01/1980)"
          inputMode="numeric"
          error={isSubmitted ? errors.birthdate?.message : undefined}
        />

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

export { AccountBirthdateForm };
