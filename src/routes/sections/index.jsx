import { Navigate, useRoutes } from 'react-router-dom';

import CompactLayout from 'src/layouts/main';

import { authRoutes } from './auth';
import { bibliotecaRoutes } from './biblioteca';
import { mainRoutes, BibliotecaInicioPage } from './main';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <CompactLayout>
          <BibliotecaInicioPage />
        </CompactLayout>
      ),
    },

    // Auth routes
    ...authRoutes,

    // Rutas de la biblioteca
    ...bibliotecaRoutes,

    // Main routes
    ...mainRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
