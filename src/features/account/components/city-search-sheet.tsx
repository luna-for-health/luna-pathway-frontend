import { useState } from 'react';

import { Input, Sheet } from '@/components/ui';
import { findCityByCoordinates, useCitySearch } from '@/features/account/api';
import {
  formatCityLabel,
  isSameCity,
  MIN_CITY_QUERY_LENGTH,
} from '@/features/account/lib/location';
import type {
  CityOption,
  CityOptionRowProps,
  CitySearchSheetProps,
} from '@/features/account/types';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { MapPinIcon, NavigationArrowIcon } from '@/icons';
import { cn } from '@/lib/utils';

const LOCATE_ERROR = 'Impossible de vous localiser. Saisissez votre code postal ou votre ville.';

function CityOptionRow({
  icon,
  iconClassName,
  label,
  selected = false,
  disabled = false,
  onClick,
}: CityOptionRowProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm leading-5 font-medium transition-colors disabled:cursor-wait disabled:opacity-60',
        selected
          ? 'bg-list-background-hover text-option-list-label-hover'
          : 'text-list-text hover:bg-list-background-hover hover:text-option-list-label-hover'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-6 shrink-0 items-center justify-center transition-colors [&_[fill]]:fill-current',
          selected ? 'text-option-list-label-hover' : iconClassName,
          'group-hover:text-option-list-label-hover'
        )}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
    </button>
  );
}

function CitySearchSheet({ open, onOpenChange, selected, onSelect }: CitySearchSheetProps) {
  const [query, setQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string>();
  const debouncedQuery = useDebouncedValue(query.trim(), 250);
  const isSearching = debouncedQuery.length >= MIN_CITY_QUERY_LENGTH;
  const { data, isError, isFetching } = useCitySearch(debouncedQuery);
  const options = isSearching ? (data ?? []) : [];

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setQuery('');
      setLocateError(undefined);
    }
    onOpenChange(nextOpen);
  }

  function select(option: CityOption) {
    onSelect(option);
    handleOpenChange(false);
  }

  function locate() {
    setLocateError(undefined);
    if (!('geolocation' in navigator)) {
      setLocateError(LOCATE_ERROR);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const city = await findCityByCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );
          if (city) select(city);
          else setLocateError(LOCATE_ERROR);
        } catch {
          setLocateError(LOCATE_ERROR);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        setLocateError(LOCATE_ERROR);
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }

  const hasNoResults = isSearching && !isFetching && !isError && options.length === 0;
  const errorMessage = locateError
    ? locateError
    : isSearching && isError
      ? 'La recherche est indisponible pour le moment, veuillez réessayer.'
      : undefined;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange} title="Où habitez-vous ?" variant="modal-md">
      <div className="flex w-full flex-col gap-4">
        <Input
          autoFocus
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Code postal ou ville"
          aria-label="Code postal ou ville"
          autoComplete="off"
        />

        {hasNoResults ? (
          <div className="text-body-secondary flex w-full flex-col gap-2 text-center text-sm leading-5">
            <p>Aucun résultat</p>
            <p>Vérifiez le code postal ou le nom de la ville.</p>
          </div>
        ) : (
          <div role="listbox" aria-label="Communes" className="flex w-full flex-col gap-1">
            <CityOptionRow
              icon={<NavigationArrowIcon className="size-6" />}
              iconClassName="text-body-primary"
              label={isLocating ? 'Localisation en cours…' : 'Autour de moi'}
              disabled={isLocating}
              onClick={locate}
            />
            {options.map(option => (
              <CityOptionRow
                key={`${option.inseeCode}-${option.postalCode}`}
                icon={<MapPinIcon size={24} />}
                iconClassName="text-form-field-text-disabled"
                label={formatCityLabel(option)}
                selected={isSameCity(option, selected)}
                onClick={() => select(option)}
              />
            ))}
          </div>
        )}

        {errorMessage && (
          <p className="text-form-field-text-errored px-3 text-sm leading-5">{errorMessage}</p>
        )}
      </div>
    </Sheet>
  );
}

export { CitySearchSheet };
