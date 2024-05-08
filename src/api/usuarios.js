import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const getUsuarios = async () => {
  const URL = endpoints.usuarios.list;

  const response = await axios.get(URL);

  return response.data;
};

export const postUsuarios = async (data) => {
  const URL = endpoints.usuarios.add;

  const res = await axios.post(URL, data);

  return res;
};

export const deleteUsuario = async (id) => {
  const URL = `${endpoints.usuarios.borrar}${id}`;

  const res = await axios.delete(URL);

  return res;
};
