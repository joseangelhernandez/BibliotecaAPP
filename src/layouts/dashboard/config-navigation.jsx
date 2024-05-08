import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  inventario: icon('ic_inventory'),
  prestamos: icon('ic_prestamo'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { user } = useAuthContext();
  const data = useMemo(() => {
    const items = [
      {
        items: [
          { title: 'Inventario', path: paths.biblioteca.root, icon: ICONS.inventario },
          { title: 'Préstamos', path: paths.biblioteca.prestamos, icon: ICONS.prestamos },
        ],
      },
    ];

    if (user?.rol === 0) {
      items[1].items.unshift({
        title: 'Usuarios',
        path: paths.biblioteca.usuarios,
        icon: ICONS.user,
      });
    }

    return items;
  }, [user]);

  return data;
}
