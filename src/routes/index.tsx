import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AccountStep1Screen } from '@/features/account/pages';
import { GdprScreen, LoginScreen, OtpScreen, WelcomeScreen } from '@/features/auth-patient/pages';
import {
  ForgotPasswordSecretaryScreen,
  LoginSecretaryScreen,
  ResetPasswordSecretaryScreen,
} from '@/features/auth-secretary/pages';

import AppLayout from './app-layout';
import HomePlaceholder from './home-placeholder';
import RequirePatientAuth from './require-patient-auth';
import RequireSecretaryAuth from './require-secretary-auth';
import RoutePlaceholder from './route-placeholder';
import SecretaryLayout from './secretary-layout';

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
        path: '/account/step-1',
        element: <AccountStep1Screen />,
      },
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
  {
    path: '/pro/login',
    element: <LoginSecretaryScreen />,
  },
  {
    path: '/secretary/login',
    element: <Navigate to="/pro/login" replace />,
  },
  {
    path: '/secretary/forgot-password',
    element: <ForgotPasswordSecretaryScreen />,
  },
  {
    path: '/secretary/reset-password',
    element: <ResetPasswordSecretaryScreen />,
  },
  {
    element: <RequireSecretaryAuth />,
    children: [
      {
        element: <SecretaryLayout />,
        children: [
          { path: '/secretary/dossiers', element: <RoutePlaceholder title="Dossiers" /> },
          { path: '/secretary/compte', element: <RoutePlaceholder title="Mon compte" /> },
        ],
      },
    ],
  },
]);
