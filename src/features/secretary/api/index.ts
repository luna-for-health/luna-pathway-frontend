import { ApiError, apiClient, tokenStorage } from '@/services';

import type {
  ConsultationRequestResource,
  ConsultationRequestsParams,
  UpdateConsultationRequestStatusPayload,
} from './types';

/** API maximum for `per_page` — the inbox has no pagination UI yet. */
const MAX_PER_PAGE = 30;

/** `GET /consultation-requests` — most recent first; omit `status` to get every status. */
export function getConsultationRequests({
  status,
  perPage = MAX_PER_PAGE,
}: ConsultationRequestsParams = {}) {
  const searchParams = new URLSearchParams({ per_page: String(perPage) });
  if (status) searchParams.set('status', status);
  return apiClient.get<ConsultationRequestResource[]>(
    `/secretary/consultation-requests?${searchParams}`
  );
}

/** `PATCH /consultation-requests/{id}/status` — staff-only; any staff member can update any request. */
export function updateConsultationRequestStatus(
  id: string,
  payload: UpdateConsultationRequestStatusPayload
) {
  return apiClient.patch<ConsultationRequestResource>(
    `/consultation-requests/${id}/status`,
    payload
  );
}

/**
 * Downloads a consultation request document. Its `url` needs the bearer token, and `apiClient`
 * only parses JSON, so this fetches the raw file.
 */
export async function getConsultationRequestDocument(url: string) {
  const token = tokenStorage.get();
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!response.ok) throw new ApiError(response.statusText, response.status);
  return response.blob();
}

export type {
  ConsultationRequestDocument,
  ConsultationRequestDocumentOcr,
  ConsultationRequestResource,
  ConsultationRequestsParams,
  ConsultationRequestStatus,
  ConsultationRequestUser,
  UpdateConsultationRequestStatusPayload,
} from './types';
