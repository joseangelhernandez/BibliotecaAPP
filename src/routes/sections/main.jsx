import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

import CompactLayout from 'src/layouts/compact';

// ----------------------------------------------------------------------

export const BibliotecaInicioPage = lazy(() => import('src/pages/biblioteca-inicio'));
const Page404 = lazy(() => import('src/pages/404'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <CompactLayout>
        <Outlet />
      </CompactLayout>
    ),
    children: [{ path: '404', element: <Page404 /> }],
  },
];
