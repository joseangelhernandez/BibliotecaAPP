import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function RenderCellRenta({ params }) {
  return <>{fCurrency(params.row.renta)}</>;
}

RenderCellRenta.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellFecha({ params }) {
  return (
    <ListItemText
      primary={fDate(params.row.actualizadoEn)}
      secondary={fTime(params.row.actualizadoEn)}
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

export function RenderCellExistencia({ params }) {
  return <>{params.row.cantidad}</>;
}

RenderCellExistencia.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellLibro({ params }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.libroInfo?.titulo}
        src={params.row.coverUrl}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primaryTypographyProps={{ noWrap: true }}
        secondaryTypographyProps={{ noWrap: true }}
        primary={
          <Link noWrap color="inherit" variant="subtitle2" sx={{ cursor: 'pointer' }}>
            {params.row.libroInfo?.titulo}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            <strong>Autor:</strong> {params.row.libroInfo?.autor}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

RenderCellLibro.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
