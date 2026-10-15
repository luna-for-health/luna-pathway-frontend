import { createBrowserRouter } from 'react-router-dom';

import { GdprScreen, LoginScreen, OtpScreen, WelcomeScreen } from '@/features/auth-patient/pages';

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
]);
