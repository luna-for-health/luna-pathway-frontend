import { useSyncExternalStore } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { savePostAuthRedirect } from '@/features/auth-patient/lib/post-auth-redirect';
import { tokenStorage } from '@/services';

/**
 * Guards the patient pages (account creation, diagnostic questionnaire, home…): without a
 * token the patient is sent to /login, and the page they wanted is remembered so the auth
 * flow brings them back to it. Re-renders when the token is removed (401, another tab) so
 * the redirect also happens mid-session.
 */
export default function RequirePatientAuth() {
  const location = useLocation();
  const role = useSyncExternalStore(tokenStorage.subscribe, tokenStorage.getRole);

  if (role !== 'patient') {
    savePostAuthRedirect(`${location.pathname}${location.search}${location.hash}`);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
