import { useMutation, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/services';

import type {
  GdprConsentData,
  LoginPayload,
  LoginResponseData,
  OauthPayload,
  OauthProvider,
  OnboardingStep,
  RegisterPayload,
  RegisterResponseData,
  SendCodePayload,
} from './types';

export function useSendCode() {
  return useMutation({
    mutationFn: (payload: SendCodePayload) => apiClient.post<null>('/auth/send-code', payload),
  });
}

export function useVerifyCode() {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiClient.post<LoginResponseData>('/auth/verify-code', payload),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      apiClient.post<RegisterResponseData>('/auth/register', payload),
  });
}

export function useOnboarding() {
  return useQuery({
    queryKey: ['onboarding'],
    queryFn: () => apiClient.get<OnboardingStep[]>('/onboarding'),
    staleTime: Infinity,
  });
}

export function useGdprConsent(email?: string) {
  return useQuery({
    queryKey: ['gdpr-consent', email],
    queryFn: () =>
      apiClient.get<GdprConsentData>(`/gdpr-consent?email=${encodeURIComponent(email!)}`),
    enabled: Boolean(email),
    staleTime: Infinity,
  });
}

/**
 * Same endpoint as `useGdprConsent`, exposed as a mutation instead of a query so it can be
 * triggered imperatively from `LoginForm`'s submit handler (checking GDPR consent status is
 * now a pre-OTP step, not something that can just auto-run off a rendered `email` prop).
 */
export function useCheckGdprConsent() {
  return useMutation({
    mutationFn: (email: string) =>
      apiClient.get<GdprConsentData>(`/gdpr-consent?email=${encodeURIComponent(email)}`),
  });
}

export function useAcceptGdpr() {
  return useMutation({
    mutationFn: () => apiClient.put<null>('/gdpr/accept'),
  });
}

/**
 * `POST /oauth/signup/:provider` — same single endpoint mobile uses for *both* login and
 * signup via a provider token (mobile's `oauth/login/:provider` mutation exists but is never
 * actually called anywhere in that app; `signup` is the one real path for both cases there).
 */
export function useSignupWithOauth() {
  return useMutation({
    mutationFn: ({ provider, payload }: { provider: OauthProvider; payload: OauthPayload }) =>
      apiClient.post<LoginResponseData>(`/oauth/signup/${provider}`, payload),
  });
}

export type {
  GdprConsentData,
  LoginPayload,
  LoginResponseData,
  OauthPayload,
  OauthProvider,
  OnboardingStep,
  RegisterPayload,
  RegisterResponseData,
  SendCodePayload,
};
