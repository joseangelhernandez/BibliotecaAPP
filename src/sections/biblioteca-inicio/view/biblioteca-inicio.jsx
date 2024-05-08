import { useState, useEffect, useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { TextField, InputAdornment } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { getInventario } from 'src/api/inventario';

import Iconify from 'src/components/iconify/iconify';
import EmptyContent from 'src/components/empty-content';

import LibrosList from '../libros-list';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function BibliotecaListView() {
  const [libros, setLibros] = useState([]);

  const librosLoading = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const fetchData = useCallback(async () => {
    try {
      librosLoading.onTrue();
      const response = await getInventario();
      setLibros(
        response.map((libro) => ({
          ...libro,
          titulo: libro.libroInfo?.titulo || '',
        }))
      );
      librosLoading.onFalse();
    } catch (error) {
      console.error(error);
      librosLoading.onFalse();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilters = useCallback(
    (name, value) => {
      if (value === '') {
        setFilters((prev) => ({
          ...prev,
          [name]: value,
        }));
        fetchData();
      } else {
        setFilters((prev) => ({
          ...prev,
          [name]: value,
        }));
        const filteredLibros = libros.filter(
          (libro) =>
            libro.libroInfo?.autor.toLowerCase().includes(value.toLowerCase()) ||
            libro.titulo.toLowerCase().includes(value.toLowerCase())
        );
        setLibros(filteredLibros);
      }
    },
    [libros, fetchData]
  );

  const notFound = !libros.length && !librosLoading.value;

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 10 }} />;

  return (
    <Container
      maxWidth="lg"
      sx={{
        mb: 15,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          my: { xs: 3, md: 5 },
        }}
      >
        Libros de la biblioteca
      </Typography>

      <TextField
        fullWidth
        placeholder="Buscar libro o autor..."
        value={filters.name}
        onChange={(e) => handleFilters('name', e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="mingcute:search-line" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 5,
        }}
      />

      {notFound && renderNotFound}

      <LibrosList libros={libros} loading={librosLoading.value} />
    </Container>
  );
}

// ----------------------------------------------------------------------
