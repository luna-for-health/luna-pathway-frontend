import { useState, type FormEvent } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Input } from '@/components/ui';
import { formatCityLabel } from '@/features/account/lib/location';
import type {
  AccountDraftState,
  AccountLocationFormProps,
  CityOption,
} from '@/features/account/types';
import { ArrowForwardIcon, MoonIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { AnalyticsEvent, analytics } from '@/services';

import { CitySearchSheet } from './city-search-sheet';

function AccountLocationForm({ className }: AccountLocationFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as AccountDraftState | null;

  const [city, setCity] = useState<CityOption | undefined>(state?.location);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!city) return;
    analytics.track(AnalyticsEvent.CompleteProfileStep, { step: 'location', status: 'success' });
    navigate('/account/step-4', { state: { ...state, location: city } });
  }

  return (
    <div className={cn('flex w-full flex-col gap-10', className)}>
      <div className="flex w-full items-start gap-4">
        <div className="bg-secondary-50 flex size-8 shrink-0 items-center justify-center rounded-lg">
          <MoonIcon size={20} fillColor="headingPrimary" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
            Où habitez-vous ?
          </p>
          <p className="text-body-secondary text-sm leading-5">
            Cette information nous permet de vous orienter au mieux et, si possible, de regrouper
            vos consultations.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="flex w-full flex-col gap-4">
        <Input
          readOnly
          value={city ? formatCityLabel(city) : ''}
          placeholder="Code postal ou ville"
          aria-haspopup="dialog"
          className="cursor-pointer"
          onClick={() => setIsSheetOpen(true)}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setIsSheetOpen(true);
            }
          }}
          onChange={event => {
            if (!event.target.value) setCity(undefined);
          }}
        />

        <div className="flex w-full flex-col items-end">
          <Button
            type="submit"
            size="xl"
            disabled={!city}
            className="w-full justify-between font-bold lg:w-auto"
          >
            Continuer
            <ArrowForwardIcon className="size-6" />
          </Button>
        </div>
      </form>

      <CitySearchSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selected={city}
        onSelect={setCity}
      />
    </div>
  );
}

export { AccountLocationForm };
