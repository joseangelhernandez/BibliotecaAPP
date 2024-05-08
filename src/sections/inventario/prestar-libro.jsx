import * as Yup from 'yup';
import Inputmask from 'inputmask';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useRef, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Stack, Button, Typography } from '@mui/material';

import { prestar } from 'src/api/prestamos';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

ModalPrestarLibroForm.propTypes = {
  close: PropTypes.func,
  refresh: PropTypes.func,
  currentlibro: PropTypes.object,
};

export default function ModalPrestarLibroForm({ currentlibro, close, refresh }) {
  const inputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const prestamoSchema = Yup.object().shape({
    identificacion: Yup.string().required('El número de identificación es requerido'),
    nombre: Yup.string().required('El nombre es requerido'),
    apellido: Yup.string().required('El apellido es requerido'),
    correoElectronico: Yup.string().required('El correo electrónico es requerido'),
    telefonoMovil: Yup.string().required('El teléfono móvil es requerido'),
    diasPrestamos: Yup.number()
      .required('Los días de préstamos es requerido')
      .min(1, 'La cantidad debe ser mayor a 0'),
  });

  const defaultValues = {
    identificacion: currentlibro?.identificacion || '',
    nombre: currentlibro?.nombre || '',
    apellido: currentlibro?.apellido || '',
    correoElectronico: currentlibro?.correoElectronico || '',
    telefonoMovil: currentlibro?.telefonoMovil || '',
    diasPrestamos: currentlibro?.diasPrestamos || null,
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(prestamoSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.libro = currentlibro.inventarioId;
      data.nombre = data.nombre.toUpperCase().trim();
      data.apellido = data.apellido.toUpperCase().trim();
      data.correoElectronico = data.correoElectronico.toLowerCase().trim();

      const response = await prestar(data);
      if (response.status === 201) {
        enqueueSnackbar('Prestamo registrado satisfactoriamente', {
          variant: 'success',
        });
        reset();
        close();
        refresh();
      } else {
        enqueueSnackbar('Error al prestar el libro', {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar('Error al prestar el libro', {
        variant: 'error',
      });
      console.log(error);
    }
  });

  useEffect(() => {
    if (!inputRef.current) return;

    const mask = new Inputmask({
      alias: 'numeric',
      groupSeparator: ',',
      autoGroup: true,
      digits: 2,
      digitsOptional: true,
      radixPoint: '.',
      placeholder: '',
      rightAlign: false,
      autoUnmask: true,
      jitMasking: true,
    });

    mask.mask(inputRef.current);
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Stack direction="row" spacing={2} pb={1} justifyContent="space-between">
            <Typography variant="h5">Título del Libro</Typography>
            <Typography variant="h5">Autor del Libro</Typography>
          </Stack>
          <Stack direction="row" spacing={2} pb={3} justifyContent="space-between">
            <Typography variant="h6">{currentlibro.titulo}</Typography>
            <Typography variant="h6">{currentlibro.libroInfo.autor}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} pb={2}>
            <RHFTextField name="identificacion" label="Número de Identidad" fullWidth />
            <RHFTextField name="correoElectronico" label="Correo Electrónico" fullWidth />
          </Stack>
          <Stack direction="row" spacing={2} pb={2}>
            <RHFTextField name="nombre" label="Nombre" fullWidth />
            <RHFTextField name="apellido" label="Apellido" fullWidth />
          </Stack>
          <Stack direction="row" spacing={2} pb={2}>
            <RHFTextField name="telefonoMovil" label="Telédono Móvil" fullWidth />
            <RHFTextField name="diasPrestamos" type="number" label="Días de Préstamos" fullWidth />
          </Stack>
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3, mb: 4 }} spacing={2}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting} color="success">
          Confirmar préstamo
        </LoadingButton>
        <Button onClick={close} variant="contained" color="error">
          Cancelar
        </Button>
      </Stack>
    </FormProvider>
  );
}
