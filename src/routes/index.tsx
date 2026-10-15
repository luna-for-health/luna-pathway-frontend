import { createBrowserRouter } from 'react-router-dom';

import { LoginScreen, OtpScreen, WelcomeScreen } from '@/features/auth-patient/pages';

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
    path: '/otp',
    element: <OtpScreen />,
  },
]);
