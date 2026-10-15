const TOKEN_KEY = 'luna-auth-token';
const ROLE_KEY = 'luna-auth-role';

/** Who the stored token belongs to — patients and secretaries share the same token slot. */
export type AuthRole = 'patient' | 'secretary';

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach(listener => listener());
}

export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string, role: AuthRole) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    notify();
  },
  remove() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    notify();
  },
  /**
   * Role of the current session, or `null` when logged out. A token saved without a role
   * (before roles were stored) counts as logged out, so it can't open either side of the app.
   */
  getRole(): AuthRole | null {
    if (!localStorage.getItem(TOKEN_KEY)) return null;
    const role = localStorage.getItem(ROLE_KEY);
    return role === 'patient' || role === 'secretary' ? role : null;
  },
  /**
   * Lets route guards react when the token disappears mid-session (401 in `apiClient`, logout)
   * or changes in another tab (`storage` event). Shaped for `useSyncExternalStore`.
   */
  subscribe(listener: Listener) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === TOKEN_KEY || event.key === ROLE_KEY || event.key === null) listener();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  },
};
