import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const getPrestamos = async () => {
  const URL = endpoints.prestamos.list;

  const response = await axios.get(URL);

  return response.data;
};

export const prestar = async (data) => {
  const URL = endpoints.prestamos.prestar;

  const res = await axios.post(URL, data);

  return res;
};

export const cambiarEstatusPrestamos = async (data) => {
  const URL = endpoints.prestamos.cambiarEstatus;

  const res = await axios.post(URL, data);

  return res;
};

export const deletePrestamo = async (id) => {
  const URL = `${endpoints.prestamos.borrar}${id}`;

  const res = await axios.delete(URL);

  return res;
};
