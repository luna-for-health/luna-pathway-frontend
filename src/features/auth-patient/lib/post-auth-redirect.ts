/**
 * Remembers which patient page someone tried to open while logged out, so the auth flow can
 * bring them back there once they're signed in.
 *
 * Kept in sessionStorage rather than route state because the path back runs through several
 * screens (login → gdpr → otp → account creation) that each navigate with their own state.
 */
const STORAGE_KEY = 'luna:post-auth-redirect';

export function savePostAuthRedirect(path: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, path);
  } catch {
    // Storage unavailable — the patient just lands on the default screen after login.
  }
}

/**
 * Returns (and forgets) the page to open after login, or `fallback` when there is none.
 *
 * Account-creation steps are never resumed directly: steps 2–4 rely on the answers of the
 * previous steps, which only live in route state. Callers send patients who still need an
 * account to /account/step-1 instead, and call this once that flow is done.
 */
export function consumePostAuthRedirect(fallback: string): string {
  let path: string | null = null;
  try {
    path = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  if (!path || !path.startsWith('/') || path.startsWith('/account/')) return fallback;
  return path;
}
