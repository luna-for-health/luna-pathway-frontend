import { createBrowserRouter } from 'react-router-dom';

import { LoginScreen, WelcomeScreen } from '@/features/auth-patient/pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomeScreen />,
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
]);
