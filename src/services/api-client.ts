import { tokenStorage } from '@/services/token-storage';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

export class ApiError extends Error {
  status: number;
  response?: IResponse;

  constructor(message: string, status: number, response?: IResponse) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<IResponse<T>> {
  const { body, headers, ...rest } = options;

  const isFormData = body instanceof FormData;
  const requestHeaders = new Headers(headers);
  if (!isFormData && !requestHeaders.has('Content-Type') && body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  requestHeaders.set('Accept', 'application/json');
  requestHeaders.set('Accept-Language', navigator.language.split('-')[0] || 'fr');
  requestHeaders.set('X-Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

  const token = tokenStorage.get();
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${baseUrl}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });

  if (response.status === 401) {
    tokenStorage.remove();
  }

  const payload = (await response.json().catch(() => undefined)) as IResponse<T> | undefined;

  if (!response.ok) {
    throw new ApiError(payload?.message ?? response.statusText, response.status, payload);
  }

  return payload as IResponse<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  postForm: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body: formData }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
