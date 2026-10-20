import type * as React from 'react';

export interface CityOption {
  postalCode: string;
  city: string;
  inseeCode: string;
}

export interface GeoCommune {
  nom: string;
  code: string;
  codesPostaux: string[];
  population?: number;
}

export interface AccountDraftState {
  firstName?: string;
  lastName?: string;
  email?: string;
  userId?: number;
  birthdate?: string;
  location?: CityOption;
  phone?: string;
}

export interface AccountNameFormProps {
  className?: string;
}

export interface AccountBirthdateFormProps {
  className?: string;
}

export interface AccountPhoneFormProps {
  className?: string;
}

export interface AccountLocationFormProps {
  className?: string;
}

export interface CitySearchSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected?: CityOption;
  onSelect: (option: CityOption) => void;
}

export interface CityOptionRowProps {
  icon: React.ReactNode;
  iconClassName: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}
