import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  getDepartmentCodes,
  getLeadingDigits,
  MAX_CITY_OPTIONS,
  MIN_CITY_QUERY_LENGTH,
  toCityOptions,
} from '@/features/account/lib/location';
import type { CityOption, GeoCommune } from '@/features/account/types';

const GEO_API_URL = 'https://geo.api.gouv.fr';
const COMMUNE_FIELDS = 'nom,code,codesPostaux,population';

async function getCommunes(path: string, signal?: AbortSignal) {
  const response = await fetch(`${GEO_API_URL}${path}`, { signal });
  if (!response.ok) throw new Error(`geo.api.gouv.fr ${response.status}`);
  return (await response.json()) as GeoCommune[];
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<CityOption[]> {
  const trimmed = query.trim();
  const digits = getLeadingDigits(trimmed);

  if (digits) {
    if (digits.length >= 5) {
      const postalCode = digits.slice(0, 5);
      const communes = await getCommunes(
        `/communes?codePostal=${postalCode}&fields=${COMMUNE_FIELDS}`,
        signal
      );
      return toCityOptions(communes, { postalPrefix: postalCode, sortByPopulation: true });
    }

    const departments = getDepartmentCodes(digits);
    if (departments.length === 0) return [];
    const results = await Promise.all(
      departments.map(department =>
        getCommunes(`/departements/${department}/communes?fields=${COMMUNE_FIELDS}`, signal).catch(
          () => [] as GeoCommune[]
        )
      )
    );
    return toCityOptions(results.flat(), { postalPrefix: digits, sortByPopulation: true });
  }

  const communes = await getCommunes(
    `/communes?nom=${encodeURIComponent(trimmed)}&fields=${COMMUNE_FIELDS}&boost=population&limit=${MAX_CITY_OPTIONS}`,
    signal
  );
  return toCityOptions(communes);
}

export async function findCityByCoordinates(latitude: number, longitude: number) {
  const communes = await getCommunes(
    `/communes?lat=${latitude}&lon=${longitude}&fields=${COMMUNE_FIELDS}`
  );
  return toCityOptions(communes)[0] ?? null;
}

export function useCitySearch(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ['account', 'city-search', trimmed],
    queryFn: ({ signal }) => searchCities(trimmed, signal),
    enabled: trimmed.length >= MIN_CITY_QUERY_LENGTH,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
