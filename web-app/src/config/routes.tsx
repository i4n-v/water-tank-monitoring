import type { RouteObject } from 'react-router-dom';
import { Dashboard, Devices } from '../pages';

const routes: RouteObject[] = [
  {
    path: '*',
    element: <>Not Found</>,
  },
  {
    path: '/',
    element: <Devices />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
];

export default routes;
