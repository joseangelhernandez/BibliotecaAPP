import sumBy from 'lodash/sumBy';
import { isBefore } from 'date-fns';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { getPrestamos, deletePrestamo, cambiarEstatusPrestamos } from 'src/api/prestamos';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import PrestamosAnalytic from '../prestamos-analytic';
import PrestamosTableRow from '../prestamos-table-row';
import PrestamosTableToolbar from '../prestamos-table-toolbar';
import PrestamosTableFiltersResult from '../prestamos-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'prestamoId', label: 'Libro prestado' },
  { id: 'nombre', label: 'Persona' },
  { id: 'correoElectronico', label: 'Contacto' },
  { id: 'inicioPrestamo', label: 'Fecha del prestamo' },
  { id: 'fechaLimite', label: 'Fecha límite' },
  { id: 'estatus', label: 'Estatus' },
  { id: '', label: 'Acciones' },
];

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const addDaysToDate = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// ----------------------------------------------------------------------

export default function PrestamosListView() {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  const settings = useSettingsContext();

  const table = useTable({ defaultOrderBy: 'fechaLimite' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const prestamos = await getPrestamos();
    if (prestamos.length) {
      setTableData(
        prestamos.map((prestamo) => ({
          ...prestamo,
          finalPrestamo: addDaysToDate(prestamo.inicioPrestamo, prestamo.diasPrestamos),
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getPrestamosLength = (status) => {
    if (status === 'fuera de fecha') {
      return tableData.filter(
        (item) => isAfter(new Date(), item.finalPrestamo) && item.estatus === 0
      ).length;
    }

    return tableData.filter(
      (item) => isBefore(new Date(), item.finalPrestamo) && item.estatus === status
    ).length;
  };

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalAmount'
    );

  const getPercentByStatus = (status) => (getPrestamosLength(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'Todos', color: 'default', count: tableData.length },
    {
      value: 0,
      label: 'Prestados',
      color: 'success',
      count: getPrestamosLength(0),
    },
    {
      value: 'fuera de fecha',
      label: 'Fuera de fecha',
      color: 'warning',
      count: getPrestamosLength('fuera de fecha'),
    },
    {
      value: 2,
      label: 'Perdidos',
      color: 'error',
      count: getPrestamosLength(2),
    },
  ];

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (id) => {
      const response = await deletePrestamo(id);

      if (response.status !== 204) {
        enqueueSnackbar('Error al eliminar el registro', { variant: 'error' });
      } else {
        enqueueSnackbar('Registro eliminado');
      }

      fetchData();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [enqueueSnackbar, table, dataInPage.length, fetchData]
  );

  const handleEditRow = useCallback(
    async (id, status) => {
      try {
        const response = await cambiarEstatusPrestamos({ PrestamoId: id, Estatus: status });

        if (response.status !== 204) {
          enqueueSnackbar('Error al cambiar el estatus', { variant: 'error' });
        } else if (status === 1) {
          enqueueSnackbar('Libro devuelto');
        } else {
          enqueueSnackbar('Libro perdido', { variant: 'warning' });
        }

        fetchData();
      } catch (e) {
        enqueueSnackbar(e.detalle, { variant: 'error' });
      }
    },
    [enqueueSnackbar, fetchData]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Préstamos de libros"
        links={[
          {
            name: 'Inventario de libros',
            href: paths.biblioteca.root,
          },
          {
            name: 'Préstamos de libros',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Scrollbar>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            <PrestamosAnalytic
              title="Total"
              total={tableData.length}
              percent={100}
              price={sumBy(tableData, 'totalAmount')}
              icon="solar:bill-list-bold-duotone"
              color={theme.palette.info.main}
            />

            <PrestamosAnalytic
              title="Prestados"
              total={getPrestamosLength(0)}
              percent={getPercentByStatus(0)}
              price={getTotalAmount(0)}
              icon="solar:file-check-bold-duotone"
              color={theme.palette.success.main}
            />
          </Stack>
        </Scrollbar>
      </Card>
      <Card
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Scrollbar>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            <PrestamosAnalytic
              title="Fuera de fecha"
              total={getPrestamosLength('fuera de fecha')}
              percent={getPercentByStatus('fuera de fecha')}
              price={getTotalAmount('fuera de fecha')}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.warning.main}
            />
            <PrestamosAnalytic
              title="Pérdidos"
              total={getPrestamosLength(2)}
              percent={getPercentByStatus(2)}
              price={getTotalAmount(2)}
              icon="solar:bell-bing-bold-duotone"
              color={theme.palette.error.main}
            />
          </Stack>
        </Scrollbar>
      </Card>

      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <PrestamosTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          dateError={dateError}
        />

        {canReset && (
          <PrestamosTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) => {
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              );
            }}
            action={
              <Stack direction="row">
                <Tooltip title="Sent">
                  <IconButton color="primary">
                    <Iconify icon="iconamoon:send-fill" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download">
                  <IconButton color="primary">
                    <Iconify icon="eva:download-outline" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Print">
                  <IconButton color="primary">
                    <Iconify icon="solar:printer-minimalistic-bold" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              </Stack>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <PrestamosTableRow
                      key={index}
                      row={row}
                      selected={table.selected.includes(row.prestamoId)}
                      onSelectRow={() => table.onSelectRow(row.prestamoId)}
                      onEditRow={handleEditRow}
                      onDeleteRow={() => handleDeleteRow(row.prestamoId)}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (prestamo) =>
        prestamo.libroInformation?.libroInfo?.titulo.toLowerCase().indexOf(name.toLowerCase()) !==
          -1 || prestamo.nombre.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    if (status === 'fuera de fecha') {
      inputData = inputData.filter(
        (prestamo) => isAfter(new Date(), prestamo.finalPrestamo) && prestamo.estatus === 0
      );
    } else {
      inputData = inputData.filter(
        (prestamo) => isBefore(new Date(), prestamo.finalPrestamo) && prestamo.estatus === status
      );
    }
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((prestamo) =>
        isBetween(prestamo.inicioPrestamo, startDate, endDate)
      );
    }
  }

  return inputData;
}
