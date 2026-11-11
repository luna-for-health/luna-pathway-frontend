import { describe, expect, it } from 'vitest';

import {
  formatCityLabel,
  getDepartmentCodes,
  getLeadingDigits,
  isSameCity,
  MAX_CITY_OPTIONS,
  toCityOptions,
  toRegisterLocation,
} from '@/features/patient-account-creation/lib/location';
import type { CityOption, GeoCommune } from '@/features/patient-account-creation/types';

const marseille1: CityOption = { postalCode: '13001', city: 'Marseille', inseeCode: '13055' };

describe('formatCityLabel', () => {
  it('shows the postal code then the city', () => {
    expect(formatCityLabel(marseille1)).toBe('13001 Marseille');
  });
});

describe('toRegisterLocation', () => {
  it('formats the city for the register payload', () => {
    expect(toRegisterLocation(marseille1)).toBe('Marseille, France');
  });

  it('returns an empty string when no city is selected', () => {
    expect(toRegisterLocation()).toBe('');
  });
});

describe('isSameCity', () => {
  it('matches on postal code and INSEE code', () => {
    expect(isSameCity(marseille1, { ...marseille1, city: 'Other name' })).toBe(true);
    expect(isSameCity(marseille1, { ...marseille1, postalCode: '13002' })).toBe(false);
    expect(isSameCity(marseille1, { ...marseille1, inseeCode: '00000' })).toBe(false);
  });

  it('is false when either city is missing', () => {
    expect(isSameCity(marseille1, undefined)).toBe(false);
    expect(isSameCity(undefined, undefined)).toBe(false);
  });
});

describe('getLeadingDigits', () => {
  it('returns the digits at the start of the query', () => {
    expect(getLeadingDigits(' 130 Marseille')).toBe('130');
  });

  it('returns undefined when the query does not start with digits', () => {
    expect(getLeadingDigits('Marseille 13')).toBeUndefined();
  });
});

describe('getDepartmentCodes', () => {
  it('needs at least 2 digits', () => {
    expect(getDepartmentCodes('1')).toEqual([]);
  });

  it('uses the first 2 digits for mainland departments', () => {
    expect(getDepartmentCodes('13001')).toEqual(['13']);
  });

  it('maps Corsica (20) to 2A and 2B', () => {
    expect(getDepartmentCodes('20000')).toEqual(['2A', '2B']);
  });

  it('uses 3 digits for overseas departments', () => {
    expect(getDepartmentCodes('97')).toEqual([]);
    expect(getDepartmentCodes('97400')).toEqual(['974']);
    expect(getDepartmentCodes('988')).toEqual(['988']);
  });
});

describe('toCityOptions', () => {
  const communes: GeoCommune[] = [
    { nom: 'Small town', code: '11111', codesPostaux: ['13990'], population: 100 },
    { nom: 'Marseille', code: '13055', codesPostaux: ['13002', '13001'], population: 870000 },
  ];

  it('creates one option per postal code, sorted by postal code', () => {
    expect(toCityOptions(communes)).toEqual([
      { postalCode: '13990', city: 'Small town', inseeCode: '11111' },
      { postalCode: '13001', city: 'Marseille', inseeCode: '13055' },
      { postalCode: '13002', city: 'Marseille', inseeCode: '13055' },
    ]);
  });

  it('puts the biggest cities first when asked', () => {
    expect(toCityOptions(communes, { sortByPopulation: true })[0].city).toBe('Marseille');
  });

  it('keeps only postal codes matching the typed prefix', () => {
    expect(toCityOptions(communes, { postalPrefix: '1300' }).map(o => o.postalCode)).toEqual([
      '13001',
      '13002',
    ]);
  });

  it(`returns at most ${MAX_CITY_OPTIONS} options`, () => {
    const many: GeoCommune[] = [
      {
        nom: 'Paris',
        code: '75056',
        codesPostaux: ['75001', '75002', '75003', '75004', '75005', '75006'],
      },
    ];
    expect(toCityOptions(many)).toHaveLength(MAX_CITY_OPTIONS);
  });

  it('does not change the original list order', () => {
    toCityOptions(communes, { sortByPopulation: true });
    expect(communes[0].nom).toBe('Small town');
  });
});
