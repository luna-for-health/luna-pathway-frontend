import { createBrowserRouter } from 'react-router-dom';

import RoutePlaceholder from './route-placeholder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RoutePlaceholder title="doctors-frontend" />,
  },
]);
