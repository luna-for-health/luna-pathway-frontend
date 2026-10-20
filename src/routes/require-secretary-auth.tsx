import { useSyncExternalStore } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { tokenStorage } from '@/services';

/**
 * Guards the secretary back-office: without a token, any /secretary/* page sends the user to
 * /pro/login, remembering where they were headed so login can bring them back there.
 * Re-renders when the token is removed (401, logout, another tab) so the redirect also
 * happens mid-session, not only on first load.
 */
export default function RequireSecretaryAuth() {
  const location = useLocation();
  const role = useSyncExternalStore(tokenStorage.subscribe, tokenStorage.getRole);

  if (role !== 'secretary') {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/pro/login" replace state={{ from }} />;
  }

  return <Outlet />;
}
