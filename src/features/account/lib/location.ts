import type { CityOption, GeoCommune } from '@/features/account/types';

export const MIN_CITY_QUERY_LENGTH = 2;
export const MAX_CITY_OPTIONS = 5;

export function formatCityLabel(option: CityOption) {
  return `${option.postalCode} ${option.city}`;
}

export function toRegisterLocation(option?: CityOption) {
  return option ? `${option.city}, France` : '';
}

export function isSameCity(a?: CityOption, b?: CityOption) {
  return Boolean(a && b && a.postalCode === b.postalCode && a.inseeCode === b.inseeCode);
}

export function getLeadingDigits(query: string) {
  return query.trim().match(/^\d+/)?.[0];
}

export function getDepartmentCodes(postalPrefix: string) {
  if (postalPrefix.length < 2) return [];
  if (postalPrefix.startsWith('20')) return ['2A', '2B'];
  if (postalPrefix.startsWith('97') || postalPrefix.startsWith('98')) {
    return postalPrefix.length >= 3 ? [postalPrefix.slice(0, 3)] : [];
  }
  return [postalPrefix.slice(0, 2)];
}

export function toCityOptions(
  communes: GeoCommune[],
  {
    postalPrefix,
    sortByPopulation = false,
  }: { postalPrefix?: string; sortByPopulation?: boolean } = {}
): CityOption[] {
  const ordered = sortByPopulation
    ? [...communes].sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    : communes;

  return ordered
    .flatMap(commune =>
      [...commune.codesPostaux]
        .filter(postalCode => !postalPrefix || postalCode.startsWith(postalPrefix))
        .sort()
        .map(postalCode => ({ postalCode, city: commune.nom, inseeCode: commune.code }))
    )
    .slice(0, MAX_CITY_OPTIONS);
}
