import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/services';

import type { ConsultationRequestPayload, ConsultationRequestResponseData } from './types';

/**
 * `documents` is sent as repeated `documents[]` entries — the Laravel-style array-in-multipart
 * convention this backend's other endpoints follow (see project memory's API integration notes).
 */
function buildConsultationRequestFormData(payload: ConsultationRequestPayload) {
  const formData = new FormData();
  formData.append('reason', payload.reason);
  if (payload.history) formData.append('history', payload.history);
  formData.append('dysmenorrhea', String(payload.dysmenorrhea));
  formData.append('pelvicPain', String(payload.pelvicPain));
  formData.append('dyspareunia', String(payload.dyspareunia));
  formData.append('digestiveIssues', String(payload.digestiveIssues));
  formData.append('urinaryIssues', String(payload.urinaryIssues));
  formData.append('fatigue', String(payload.fatigue));
  // Multipart has no boolean type — '1'/'0' is what Laravel's `boolean` rule accepts.
  formData.append('has_mri', payload.hasMri ? '1' : '0');
  payload.documents?.forEach(file => formData.append('documents[]', file));
  return formData;
}

export function useCreateConsultationRequest() {
  return useMutation({
    mutationFn: (payload: ConsultationRequestPayload) =>
      apiClient.postForm<ConsultationRequestResponseData>(
        '/consultation-requests',
        buildConsultationRequestFormData(payload)
      ),
  });
}

export type {
  ConsultationRequestPayload,
  ConsultationRequestSymptomScores,
  ConsultationRequestResponseData,
  SkillOption,
} from './types';
