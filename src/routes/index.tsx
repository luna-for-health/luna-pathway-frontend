import { createBrowserRouter } from 'react-router-dom';

import { WelcomeScreen } from '@/features/auth-patient/pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomeScreen />,
  },
]);
