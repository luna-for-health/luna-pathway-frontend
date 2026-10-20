import { createBrowserRouter } from 'react-router-dom';

import { GdprScreen, LoginScreen, OtpScreen, WelcomeScreen } from '@/features/auth-patient/pages';

import AppLayout from './app-layout';
import HomePlaceholder from './home-placeholder';
import RequirePatientAuth from './require-patient-auth';
import RoutePlaceholder from './route-placeholder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomeScreen />,
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/gdpr',
    element: <GdprScreen />,
  },
  {
    path: '/otp',
    element: <OtpScreen />,
  },
  {
    element: <RequirePatientAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/home', element: <HomePlaceholder /> },
          { path: '/annuaire', element: <RoutePlaceholder title="Annuaire" /> },
          { path: '/compte', element: <RoutePlaceholder title="Mon compte" /> },
        ],
      },
    ],
  },
]);
