import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { fTime, fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function RenderCellFecha({ params }) {
  return (
    <ListItemText
      primary={fDate(params.row.creadoEn)}
      secondary={fTime(params.row.creadoEn)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

RenderCellFecha.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellRol({ params }) {
  return (
    <>
      {(params.row.rol === 0 && 'Super User') ||
        (params.row.rol === 1 && 'Admin') ||
        (params.row.rol === 2 && 'Cajero')}
    </>
  );
}

RenderCellRol.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellUsuario({ params }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar alt={params.row.nombreUsuario} sx={{ mr: 2 }}>
        {params.row.nombreUsuario.charAt(0).toUpperCase()}
      </Avatar>

      <Typography variant="body2">{params.row.nombreUsuario.toUpperCase()}</Typography>
    </Stack>
  );
}

RenderCellUsuario.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
