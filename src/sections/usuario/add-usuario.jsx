import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Grid, Stack, Button, Divider, MenuItem } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { postUsuarios } from 'src/api/usuarios';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

ModalAddUserForm.propTypes = {
  close: PropTypes.func,
  refresh: PropTypes.func,
};

const RolesOptions = [
  { value: '0', label: 'Super User' },
  { value: '1', label: 'Admin' },
  { value: '2', label: 'Cajero' },
];

export default function ModalAddUserForm({ close, refresh }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const password = useBoolean();
  const Repassword = useBoolean();
  const userSchema = Yup.object().shape({
    nombreUsuario: Yup.string().required('El usuario es requerido'),
    rol: Yup.string().required('El rol es requerido'),
    contraseña: Yup.string()
      .required('La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    repetirContraseña: Yup.string()
      .oneOf([Yup.ref('contraseña'), null], 'Las contraseñas deben coincidir')
      .required('Debe confirmar la contraseña'),
  });

  const defaultValues = {
    nombreUsuario: '',
    rol: '',
    contraseña: '',
    repetirContraseña: '',
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(userSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.rol = parseInt(data.rol, 10);
      data.creadoPor = user.id;
      const response = await postUsuarios(data);
      if (response.status === 200) {
        enqueueSnackbar('Usuario agregado satisfactoriamente', {
          variant: 'success',
        });
        refresh();
        reset();
        close();
      } else {
        enqueueSnackbar('Error al agregar el usuario', {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar(error?.detalle || 'Error inesperado al agregar usuario', {
        variant: 'error',
      });
      console.log(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2} p={1}>
        <Grid item xs={12} md={12}>
          <Stack direction="row" spacing={2}>
            <RHFTextField name="nombreUsuario" label="Nombre de usuario" fullWidth />
          </Stack>
        </Grid>
        <Grid item xs={12} md={12}>
          <RHFSelect name="rol" label="Seleccione el rol">
            <MenuItem value="">Ninguno</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {RolesOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={12}>
          <Stack direction="row" spacing={2}>
            <RHFTextField
              name="contraseña"
              label="Contraseña"
              type={password.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <RHFTextField
              name="repetirContraseña"
              label="Confirmar Contraseña"
              type={Repassword.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={Repassword.onToggle} edge="end">
                      <Iconify
                        icon={Repassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3, mb: 4 }} spacing={2}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting} color="success">
          Agregar
        </LoadingButton>
        <Button onClick={close} variant="contained" color="error">
          Cancelar
        </Button>
      </Stack>
    </FormProvider>
  );
}
