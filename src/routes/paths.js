// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  BIBLIOTECA: '/biblioteca',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
    },
  },
  // BIBLIOTECA
  biblioteca: {
    root: ROOTS.BIBLIOTECA,
    inventario: `${ROOTS.BIBLIOTECA}/inventario`,
    prestamos: `${ROOTS.BIBLIOTECA}/prestamos`,
    usuarios: `${ROOTS.BIBLIOTECA}/usuarios`,
  },
};
