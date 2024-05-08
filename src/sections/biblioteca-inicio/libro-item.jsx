import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { fCurrency } from 'src/utils/format-number';

import Image from 'src/components/image';

// ----------------------------------------------------------------------

export default function LibroItem({ libro }) {
  const { libroInfo, titulo, cantidad, renta } = libro;

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      <Tooltip title={cantidad <= 0 && 'Sin existencias'} placement="bottom-end">
        <Image
          alt={titulo}
          src="/assets/background/overlay_3.jpg"
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            ...(cantidad <= 0 && {
              opacity: 0.48,
              filter: 'grayscale(1)',
            }),
          }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack sx={{ p: 3, pt: 2 }}>
      <Typography color="inherit" variant="subtitle1" noWrap>
        {titulo}
      </Typography>

      <Typography color="inherit" variant="subtitle2" sx={{ color: 'text.disabled' }} noWrap pb={3}>
        <strong>Autor:</strong> {libroInfo?.autor}
      </Typography>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {cantidad > 0 && (
          <Stack direction="column" sx={{ typography: 'subtitle2' }}>
            <Box component="span">Disponibles</Box>
            <Box component="span">{cantidad}</Box>
          </Stack>
        )}
        <Stack direction="column" sx={{ typography: 'subtitle2', textAlign: 'end' }}>
          <Box component="span">Precio</Box>
          <Box component="span">{fCurrency(renta)}</Box>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      {renderImg}

      {renderContent}
    </Card>
  );
}

LibroItem.propTypes = {
  libro: PropTypes.object,
};
