import PropTypes from 'prop-types';
import { isAfter, isBefore } from 'date-fns';

import Link from '@mui/material/Link';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PrestamosTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow }) {
  const { user } = useAuthContext();
  const {
    nombre,
    inicioPrestamo,
    prestamoId,
    estatus,
    apellido,
    correoElectronico,
    identificacion,
    telefonoMovil,
    libroInformation,
    finalPrestamo,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected} key={prestamoId}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={libroInformation?.libroInfo?.titulo} sx={{ mr: 2 }}>
            {libroInformation?.libroInfo?.titulo.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            disableTypography
            primary={<Typography variant="body2">{libroInformation?.libroInfo?.titulo}</Typography>}
            secondary={
              <Link variant="body2" sx={{ color: 'text.disabled', cursor: 'pointer' }}>
                <strong>Autor:</strong> {libroInformation?.libroInfo?.autor}
              </Link>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {nombre}
                <br /> {apellido}
              </Typography>
            }
            secondary={
              <Link noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                <strong>ID:</strong> {identificacion}
              </Link>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {correoElectronico}
              </Typography>
            }
            secondary={
              <Link noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                <strong>Móvil:</strong> {telefonoMovil}
              </Link>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(inicioPrestamo)}
            secondary={fTime(inicioPrestamo)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(finalPrestamo)}
            secondary={fTime(finalPrestamo)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (estatus === 0 && isBefore(new Date(), finalPrestamo) && 'success') ||
              (estatus === 1 && 'warning') ||
              (estatus === 2 && 'error') ||
              'default'
            }
          >
            {estatus === 0 && isBefore(new Date(), finalPrestamo) && 'Prestado'}
            {estatus === 1 && 'Devuelto'}

            {estatus === 2 && 'Perdido'}
            {estatus === 0 && isAfter(new Date(), finalPrestamo) && 'Prestado'}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          {estatus === 0 && (
            <Tooltip title="Devolver Libro" arrow placement="top">
              <IconButton color="inherit" onClick={() => onEditRow(prestamoId, 1)}>
                <Iconify icon="icon-park-outline:return" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        {estatus === 0 && (
          <>
            <MenuItem
              onClick={() => {
                onEditRow(prestamoId, 2);
                popover.onClose();
              }}
            >
              <Iconify icon="mingcute:question-fill" />
              Perdido
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />
          </>
        )}

        <MenuItem
          disabled={user?.rol === 2}
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Eliminar
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Elminar registro de préstamo"
        content="¿Estás seguro de que deseas eliminar este registro de préstamo?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Elminar
          </Button>
        }
      />
    </>
  );
}

PrestamosTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
