import * as Yup from 'yup';
import Inputmask from 'inputmask';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRef, useState, useEffect, useCallback } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Stack, Button, Typography, InputAdornment } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { putInventario, postInventario } from 'src/api/inventario';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFUpload, RHFTextField } from 'src/components/hook-form';

ModalAddEditLibroForm.propTypes = {
  close: PropTypes.func,
  refresh: PropTypes.func,
  currentlibro: PropTypes.object,
};

export default function ModalAddEditLibroForm({ currentlibro, close, refresh }) {
  const inputRef = useRef(null);
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isProcessing, setIsProcessing] = useState(false);

  const libroSchema = Yup.object().shape({
    titulo: Yup.string().required('El título es requerido'),
    autor: Yup.string().required('El autor es requerido'),
    cantidad: Yup.number()
      .required('La cantidad es requerida')
      .min(1, 'La cantidad debe ser mayor a 0'),
    portada: Yup.mixed().required('La portada es requerido'),
    renta: Yup.string().required('La renta es requerida'),
  });

  const defaultValues = {
    titulo: currentlibro?.titulo || '',
    autor: currentlibro?.libroInfo?.autor || '',
    cantidad: currentlibro?.cantidad || null,
    portada: currentlibro?.libroInfo?.logo || null,
    renta: currentlibro?.renta || '',
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(libroSchema),
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.usuario = user.id;
      data.renta = Number(data.renta);
      data.categoria = 1;

      if (currentlibro) {
        data.libroInfo = {
          id: currentlibro?.libro,
          titulo: data.titulo,
          autor: data.autor,
          actualizadoPor: data.usuario,
        };
        data.inventarioId = currentlibro?.inventarioId;
        const response = await putInventario(data);
        if (response.status === 204) {
          enqueueSnackbar('Libro actualizado con éxito', 'success');
          reset();
          close();
          refresh();
        } else {
          enqueueSnackbar('Error al actualizar el libro', 'error');
        }
      } else {
        const response = await postInventario(data);
        if (response.status === 201) {
          enqueueSnackbar('Libro agregado satisfactoriamente', {
            variant: 'success',
          });
          reset();
          close();
          refresh();
        } else {
          enqueueSnackbar('Error al agregar el libro', {
            variant: 'error',
          });
        }
      }
    } catch (error) {
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

  const handleDropSingleFile = useCallback(
    (acceptedFiles) => {
      try {
        setIsProcessing(true);
        const file = acceptedFiles[0];

        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });

        if (newFile) {
          setValue('portada', newFile, { shouldValidate: true });
        }

        setIsProcessing(false);
      } catch (e) {
        console.error(e);
        setIsProcessing(false);
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2} pt={2}>
        <Grid item xs={12} md={12}>
          <Stack direction="row" spacing={2} pb={2}>
            <RHFTextField name="titulo" label="Título del libro" fullWidth />
            <RHFTextField name="autor" label="Autor del libro" fullWidth />
          </Stack>
          <Stack direction="row" spacing={2} pb={2}>
            <RHFTextField name="cantidad" label="Cantidad de existencias" type="number" fullWidth />
            <RHFTextField
              name="renta"
              label="Precio de renta"
              placeholder="0.00"
              inputRef={inputRef}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">RD $</InputAdornment>,
              }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="h6" pb={2}>
            Portada
          </Typography>
          <Stack direction="row" spacing={2}>
            <RHFUpload
              name="portada"
              maxSize={80000}
              helperText="Tamaño máximo: 80kb"
              onDrop={handleDropSingleFile}
              onDelete={
                isProcessing
                  ? undefined
                  : () => {
                      setValue('portada', null, { shouldValidate: false });
                    }
              }
              disabled={isProcessing}
            />
          </Stack>
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3, mb: 4 }} spacing={2}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting} color="success">
          {currentlibro ? 'Modificar' : 'Agregar'}
        </LoadingButton>
        <Button onClick={close} variant="contained" color="error">
          Cancelar
        </Button>
      </Stack>
    </FormProvider>
  );
}
