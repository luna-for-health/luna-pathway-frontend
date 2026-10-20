export interface SendCodePayload {
  email: string;
  type: 'login' | 'signup';
}

export interface LoginPayload {
  email: string;
  code: string;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  has_accepted_gdpr: boolean;
  has_completed_onboarding?: boolean;
}

export interface LoginResponseData {
  user: AuthUser;
  access_token: string;
}

export interface RegisterPayload {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthdate: string;
  location: string;
  avatar: number;
}

export interface RegisterResponseData {
  user: AuthUser;
  access_token?: string;
}

export interface OnboardingStep {
  step: number;
  title: string | null;
  description: string | null;
  paragraphs: string[] | null;
  icon: string | null;
  media: string | null;
}

export interface GdprItem {
  step: number;
  title: string | null;
  paragraphs: string[] | null;
  icon: string | null;
  media: string | null;
  media_text: string | null;
  link: string | null;
  backgroundColor: string | null;
}

export interface GdprConsentData {
  gdpr: GdprItem[];
  user: AuthUser | null;
}

export type OauthProvider = 'google' | 'apple';

export interface OauthPayload {
  access_token: string;
  locale: string;
  first_name?: string;
  last_name?: string;
}
