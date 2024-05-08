import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const InventarioPagina = lazy(() => import('src/pages/biblioteca/inventario'));
const PrestamosPagina = lazy(() => import('src/pages/biblioteca/prestamos'));
const UsuariosPagina = lazy(() => import('src/pages/biblioteca/usuarios'));

// ----------------------------------------------------------------------

export const bibliotecaRoutes = [
  {
    path: 'biblioteca',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <InventarioPagina />, index: true },
      { path: 'prestamos', element: <PrestamosPagina /> },
      { path: 'usuarios', element: <UsuariosPagina /> },
    ],
  },
];
