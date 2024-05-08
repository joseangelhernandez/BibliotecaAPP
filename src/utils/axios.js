import axios from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject((error.response && error.response.data) || 'Algo anda mal. Intente de nuevo.')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    perfil: '/api/Usuarios/perfil',
    login: '/api/Usuarios/login',
    register: '/api/auth/register',
  },
  inventario: {
    list: '/api/Inventarios',
    listLibros: '/api/Libros',
    addInventory: '/api/Inventarios',
    addLibro: '/api/Libros',
    borrarLibro: '/api/Libros/',
    borrarInventario: '/api/Inventarios/',
    putLibro: '/api/Libros/',
    putInventario: '/api/Inventarios/',
  },
  prestamos: {
    list: '/api/Prestamos',
    prestar: '/api/Prestamos/prestar',
    cambiarEstatus: '/api/Prestamos/cambiarEstatus',
    borrar: '/api/Prestamos/',
  },
  usuarios: {
    list: '/api/Usuarios',
    add: '/api/Usuarios',
    borrar: '/api/Usuarios/',
  },
};
