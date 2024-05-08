import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const getInventario = async () => {
  const URL = endpoints.inventario.list;

  const response = await axios.get(URL);

  return response.data;
};

export const postInventario = async (data) => {
  const LibroURL = endpoints.inventario.addLibro;
  const URLInventario = endpoints.inventario.addInventory;

  const dataLibro = {
    titulo: data.titulo.toUpperCase().trim(),
    autor: data.autor.toUpperCase().trim(),
    categoria: data.categoria,
    usuario: data.usuario,
  };

  const resLibro = await axios.post(LibroURL, dataLibro);

  const dataInventario = {
    libro: resLibro?.data.id,
    cantidad: data.cantidad,
    usuario: data.usuario,
    renta: data.renta,
  };

  const res = await axios.post(URLInventario, dataInventario);

  return res;
};

export const deleteLibro = async (idLibro, idInventario) => {
  const URL = `${endpoints.inventario.borrarLibro}${idLibro}`;
  const URLInventario = `${endpoints.inventario.borrarInventario}${idInventario}`;

  await axios.delete(URL);
  const res = await axios.delete(URLInventario);

  return res;
};

export const putInventario = async (data) => {
  const LibroURL = `${endpoints.inventario.putLibro}${data.libroInfo.id}`;
  const URLInventario = `${endpoints.inventario.putInventario}${data.inventarioId}`;

  const dataLibro = {
    titulo: data.libroInfo.titulo.toUpperCase().trim(),
    autor: data.libroInfo.autor.toUpperCase().trim(),
    categoria: data.libroInfo.categoria,
    usuario: data.libroInfo.actualizadoPor,
  };

  await axios.put(LibroURL, dataLibro);

  const dataInventario = {
    libro: data.libro,
    cantidad: data.cantidad,
    usuario: data.actualizadoPor,
    renta: data.renta,
  };

  const res = await axios.put(URLInventario, dataInventario);

  return res;
};
