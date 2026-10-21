import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/services';

import type {
  SecretaryForgotPasswordPayload,
  SecretaryLoginPayload,
  SecretaryLoginResponseData,
  SecretaryResetPasswordPayload,
  SecretaryUser,
} from './types';

export function useSecretaryLogin() {
  return useMutation({
    mutationFn: (payload: SecretaryLoginPayload) =>
      apiClient.post<SecretaryLoginResponseData>('/secretary/login', payload),
  });
}

export function useSecretaryForgotPassword() {
  return useMutation({
    mutationFn: (payload: SecretaryForgotPasswordPayload) =>
      apiClient.post('/secretary/password/forgot', payload),
  });
}

export function useSecretaryResetPassword() {
  return useMutation({
    mutationFn: (payload: SecretaryResetPasswordPayload) =>
      apiClient.post('/secretary/password/reset', payload),
  });
}

export function useSecretaryLogout() {
  return useMutation({
    mutationFn: () => apiClient.post<null>('/secretary/logout'),
  });
}

export type {
  SecretaryForgotPasswordPayload,
  SecretaryLoginPayload,
  SecretaryLoginResponseData,
  SecretaryResetPasswordPayload,
  SecretaryUser,
};
