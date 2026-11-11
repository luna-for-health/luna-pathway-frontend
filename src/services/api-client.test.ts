import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, apiClient } from '@/services/api-client';
import { tokenStorage } from '@/services/token-storage';

interface FakeResponseInit {
  status?: number;
  statusText?: string;
  body?: unknown;
  invalidJson?: boolean;
}

function fakeResponse({ status = 200, statusText = 'OK', body, invalidJson }: FakeResponseInit) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: invalidJson
      ? () => Promise.reject(new SyntaxError('bad json'))
      : () => Promise.resolve(body),
  };
}

const fetchMock = vi.fn();

function lastRequest() {
  const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
  return { url, init, headers: init.headers as Headers };
}

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(fakeResponse({ body: { success: true, data: 'ok' } }));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the parsed payload on success', async () => {
    await expect(apiClient.get('/me')).resolves.toEqual({ success: true, data: 'ok' });
  });

  it('calls the API path with the right method', async () => {
    await apiClient.get('/a');
    expect(lastRequest().url).toMatch(/\/a$/);
    expect(lastRequest().init.method).toBe('GET');

    await apiClient.put('/b', { x: 1 });
    expect(lastRequest().init.method).toBe('PUT');

    await apiClient.patch('/c', { x: 1 });
    expect(lastRequest().init.method).toBe('PATCH');

    await apiClient.delete('/d');
    expect(lastRequest().init.method).toBe('DELETE');
  });

  it('sends JSON bodies with a JSON content type', async () => {
    await apiClient.post('/auth/send-code', { email: 'a@b.c' });
    const { init, headers } = lastRequest();

    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify({ email: 'a@b.c' }));
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Accept')).toBe('application/json');
  });

  it('sends FormData as is, letting the browser set the content type', async () => {
    const form = new FormData();
    form.append('file', 'content');
    await apiClient.postForm('/documents', form);
    const { init, headers } = lastRequest();

    expect(init.body).toBe(form);
    expect(headers.has('Content-Type')).toBe(false);
  });

  it('sends no body and no content type when there is no body', async () => {
    await apiClient.get('/me');
    const { init, headers } = lastRequest();

    expect(init.body).toBeUndefined();
    expect(headers.has('Content-Type')).toBe(false);
  });

  it('keeps a content type set by the caller', async () => {
    await apiClient.post('/raw', 'text', { headers: { 'Content-Type': 'text/plain' } });
    expect(lastRequest().headers.get('Content-Type')).toBe('text/plain');
  });

  it('sends the language and time zone headers', async () => {
    await apiClient.get('/me');
    const { headers } = lastRequest();

    expect(headers.get('Accept-Language')).toBe(navigator.language.split('-')[0]);
    expect(headers.get('X-Timezone')).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone);
  });

  it('adds the bearer token when logged in, and nothing otherwise', async () => {
    await apiClient.get('/me');
    expect(lastRequest().headers.has('Authorization')).toBe(false);

    tokenStorage.set('secret-token', 'patient');
    await apiClient.get('/me');
    expect(lastRequest().headers.get('Authorization')).toBe('Bearer secret-token');
  });

  it('throws an ApiError with the backend message and status', async () => {
    const body = { success: false, message: 'Code invalide.' };
    fetchMock.mockResolvedValue(fakeResponse({ status: 422, body }));

    const error = await apiClient.post('/auth/verify-code', {}).catch(e => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: 'Code invalide.', status: 422, response: body });
  });

  it('falls back to the HTTP status text when the error body is not JSON', async () => {
    fetchMock.mockResolvedValue(
      fakeResponse({ status: 500, statusText: 'Internal Server Error', invalidJson: true })
    );

    const error = await apiClient.get('/me').catch(e => e);
    expect(error).toMatchObject({ message: 'Internal Server Error', status: 500 });
    expect(error.response).toBeUndefined();
  });

  it('logs the user out on a 401', async () => {
    tokenStorage.set('expired', 'patient');
    fetchMock.mockResolvedValue(
      fakeResponse({ status: 401, body: { message: 'Unauthenticated.' } })
    );

    await expect(apiClient.get('/me')).rejects.toBeInstanceOf(ApiError);
    expect(tokenStorage.get()).toBeNull();
  });

  it('keeps the session on other errors', async () => {
    tokenStorage.set('valid', 'patient');
    fetchMock.mockResolvedValue(
      fakeResponse({ status: 429, body: { message: 'Too Many Attempts.' } })
    );

    await expect(apiClient.get('/me')).rejects.toMatchObject({ status: 429 });
    expect(tokenStorage.get()).toBe('valid');
  });
});
