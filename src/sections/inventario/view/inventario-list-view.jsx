/* eslint-disable react/jsx-no-bind */
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { deleteLibro, putInventario, getInventario } from 'src/api/inventario';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ModalPrestarLibroForm from '../prestar-libro';
import ModalAddEditLibroForm from '../add-edit-libro';
import {
  RenderCellFecha,
  RenderCellLibro,
  RenderCellRenta,
  RenderCellExistencia,
} from '../inventario-table-row';

// ----------------------------------------------------------------------

export default function LibroListView() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [currentLibro, setCurrentLibro] = useState(null);
  const [loading, setLoading] = useState(false);

  const confirmRows = useBoolean();
  const addEditLibro = useBoolean();
  const prestarLibro = useBoolean();

  const [tableData, setTableData] = useState([]);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const libros = await getInventario();
    if (libros.length) {
      setTableData(libros.map((libro) => ({ ...libro, titulo: libro.libroInfo?.titulo || '' })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dataFiltered = applyFilter({
    inputData: tableData,
  });

  const handleDeleteRow = useCallback(async () => {
    const response = await deleteLibro(currentLibro.libroInfo.id, currentLibro.inventarioId);

    if (response.status === 204) {
      fetchData();
      enqueueSnackbar('Libro Eliminado satisfactoriamente');
    } else {
      enqueueSnackbar('Error al eliminar el libro', { variant: 'error' });
    }

    fetchData();
    setCurrentLibro(null);
  }, [enqueueSnackbar, fetchData, currentLibro]);

  const handleEditRow = useCallback(
    (row) => {
      setCurrentLibro(row);
      addEditLibro.onTrue();
    },
    [setCurrentLibro, addEditLibro]
  );

  const handlePrestarRow = useCallback(
    (row) => {
      setCurrentLibro(row);
      prestarLibro.onTrue();
    },
    [setCurrentLibro, prestarLibro]
  );

  const handleEditByCell = useCallback(
    async (params, event) => {
      const { field, row } = params;
      const { value } = event.target;

      const updatedObject = {
        ...row,
        [field]: Number(value),
      };

      const response = await putInventario(updatedObject);

      if (response.status === 204) {
        enqueueSnackbar('Actualizado satisfactoriamente');
        fetchData();
      } else {
        enqueueSnackbar('Error al actualizar el libro', { variant: 'error' });
      }
    },
    [fetchData, enqueueSnackbar]
  );

  const columns = [
    {
      field: 'titulo',
      headerName: 'Libro',
      flex: 1,
      minWidth: 250,
      hideable: false,
      renderCell: (params) => <RenderCellLibro params={params} />,
    },
    {
      field: 'actualizadoEn',
      headerName: 'Actualizado En',
      width: 160,
      renderCell: (params) => <RenderCellFecha params={params} />,
    },
    {
      field: 'cantidad',
      headerName: 'Existencias',
      width: 160,
      type: 'number',
      editable: user?.rol !== 2,
      renderCell: (params) => <RenderCellExistencia params={params} />,
    },
    {
      field: 'renta',
      headerName: 'Renta',
      width: 140,
      editable: user?.rol !== 2,
      type: 'number',
      renderCell: (params) => <RenderCellRenta params={params} />,
    },
    {
      field: 'accion',
      headerName: 'Acción',
      width: 110,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Button
          variant="contained"
          style={{ width: '100%' }}
          onClick={() => handlePrestarRow(params.row)}
          disabled={params.row.cantidad <= 0}
        >
          {params.row.cantidad <= 0 ? 'Sin existencias' : 'Prestar'}
        </Button>
      ),
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Editar"
          disabled={user?.rol === 2}
          onClick={() => handleEditRow(params.row)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Borrar"
          disabled={user?.rol === 2}
          onClick={() => {
            setCurrentLibro(params.row);
            confirmRows.onTrue();
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () => columns.map((column) => column.field);

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Biblioteca"
          links={[{ name: 'Inventario de Libros' }]}
          action={
            <Button
              onClick={() => {
                setCurrentLibro(null);
                addEditLibro.onTrue();
              }}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo Libro
            </Button>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card
          sx={{
            height: { xs: 800, md: 2 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.inventarioId}
            onCellEditStop={handleEditByCell}
            localeText={{
              // Selector de densidad en la barra de herramientas
              toolbarDensity: 'Densidad',
              toolbarDensityLabel: 'Densidad',
              toolbarDensityCompact: 'Compacto',
              toolbarDensityStandard: 'Estándar',
              toolbarDensityComfortable: 'Cómodo',

              // Selector de columnas en la barra de herramientas
              toolbarColumns: 'Columnas',
              toolbarColumnsLabel: 'Seleccionar columnas',

              // Botón de filtros en la barra de herramientas
              toolbarFilters: 'Filtros',
              toolbarFiltersLabel: 'Mostrar filtros',
              toolbarFiltersTooltipHide: 'Ocultar filtros',
              toolbarFiltersTooltipShow: 'Mostrar filtros',
              toolbarFiltersTooltipActive: (count) =>
                count !== 1 ? `${count} activo filtros` : `${count} filtro activo`,

              // Campo de filtro rápido en la barra de herramientas
              toolbarQuickFilterPlaceholder: 'Buscar…',
              toolbarQuickFilterLabel: 'Buscar',
              toolbarQuickFilterDeleteIconLabel: 'Limpiar',

              // Selector de exportación en la barra de herramientas
              toolbarExport: 'Exportar',
              toolbarExportLabel: 'Exportar',
              toolbarExportCSV: 'Descargar como CSV',
              toolbarExportPrint: 'Imprimir',
              toolbarExportExcel: 'Descargar como Excel',

              // Texto del panel de columnas
              columnsPanelTextFieldLabel: 'Buscar columna',
              columnsPanelTextFieldPlaceholder: 'Título de la columna',
              columnsPanelDragIconLabel: 'Reordenar columna',
              columnsPanelShowAllButton: 'Mostrar todas',
              columnsPanelHideAllButton: 'Ocultar todas',

              // Texto del panel de filtros
              filterPanelAddFilter: 'Añadir filtro',
              filterPanelRemoveAll: 'Eliminar todos',
              filterPanelDeleteIconLabel: 'Eliminar',
              filterPanelLogicOperator: 'Operador lógico',
              filterPanelOperator: 'Operador',
              filterPanelOperatorAnd: 'Y',
              filterPanelOperatorOr: 'O',
              filterPanelColumns: 'Columnas',
              filterPanelInputLabel: 'Valor',
              filterPanelInputPlaceholder: 'Valor del filtro',

              // Texto de operadores de filtro
              filterOperatorContains: 'contiene',
              filterOperatorEquals: 'iguala',
              filterOperatorStartsWith: 'empieza con',
              filterOperatorEndsWith: 'termina con',
              filterOperatorIs: 'es',
              filterOperatorNot: 'no es',
              filterOperatorAfter: 'es después de',
              filterOperatorOnOrAfter: 'es en o después de',
              filterOperatorBefore: 'es antes de',
              filterOperatorOnOrBefore: 'es en o antes de',
              filterOperatorIsEmpty: 'está vacío',
              filterOperatorIsNotEmpty: 'no está vacío',
              filterOperatorIsAnyOf: 'es alguno de',
              'filterOperator=': '=',
              'filterOperator!=': '!=',
              'filterOperator>': '>',
              'filterOperator>=': '>=',
              'filterOperator<': '<',
              'filterOperator<=': '<=',

              // Texto de operadores de filtro de encabezado
              headerFilterOperatorContains: 'Contiene',
              headerFilterOperatorEquals: 'Iguala',
              headerFilterOperatorStartsWith: 'Empieza con',
              headerFilterOperatorEndsWith: 'Termina con',
              headerFilterOperatorIs: 'Es',
              headerFilterOperatorNot: 'No es',
              headerFilterOperatorAfter: 'Es después de',
              headerFilterOperatorOnOrAfter: 'Es en o después de',
              headerFilterOperatorBefore: 'Es antes de',
              headerFilterOperatorOnOrBefore: 'Es en o antes de',
              headerFilterOperatorIsEmpty: 'Está vacío',
              headerFilterOperatorIsNotEmpty: 'No está vacío',
              headerFilterOperatorIsAnyOf: 'Es alguno de',
              'headerFilterOperator=': 'Iguala',
              'headerFilterOperator!=': 'No iguala',
              'headerFilterOperator>': 'Mayor que',
              'headerFilterOperator>=': 'Mayor o igual que',
              'headerFilterOperator<': 'Menor que',
              'headerFilterOperator<=': 'Menor o igual que',

              // Texto de valores de filtro
              filterValueAny: 'cualquiera',
              filterValueTrue: 'verdadero',
              filterValueFalse: 'falso',

              // Texto del menú de columnas
              columnMenuLabel: 'Menú',
              columnMenuShowColumns: 'Mostrar columnas',
              columnMenuManageColumns: 'Gestionar columnas',
              columnMenuFilter: 'Filtrar',
              columnMenuHideColumn: 'Ocultar columna',
              columnMenuUnsort: 'Desordenar',
              columnMenuSortAsc: 'Ordenar ASC',
              columnMenuSortDesc: 'Ordenar DESC',

              // Texto del encabezado de columna
              columnHeaderFiltersTooltipActive: (count) =>
                count !== 1 ? `${count} filtros activos` : `${count} filtro activo`,
              columnHeaderFiltersLabel: 'Mostrar filtros',
              columnHeaderSortIconLabel: 'Ordenar',

              // Texto del pie de página de filas seleccionadas
              footerRowSelected: (count) =>
                count !== 1
                  ? `${count.toLocaleString()} filas seleccionadas`
                  : `${count.toLocaleString()} fila seleccionada`,

              // Texto del pie de página del total de filas
              footerTotalRows: 'Total de Filas:',

              // Texto del pie de página del total de filas visibles
              footerTotalVisibleRows: (visibleCount, totalCount) =>
                `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,

              // Texto de selección de casillas de verificación
              checkboxSelectionHeaderName: 'Selección de casilla',
              checkboxSelectionSelectAllRows: 'Seleccionar todas las filas',
              checkboxSelectionUnselectAllRows: 'Deseleccionar todas las filas',
              checkboxSelectionSelectRow: 'Seleccionar fila',
              checkboxSelectionUnselectRow: 'Deseleccionar fila',

              // Texto de celda booleana
              booleanCellTrueLabel: 'sí',
              booleanCellFalseLabel: 'no',

              // Texto de más en celda de acciones
              actionsCellMore: 'más',

              // Texto de anclaje de columnas
              pinToLeft: 'Anclar a la izquierda',
              pinToRight: 'Anclar a la derecha',
              unpin: 'Desanclar',

              // Datos de árbol
              treeDataGroupingHeaderName: 'Grupo',
              treeDataExpand: 'ver hijos',
              treeDataCollapse: 'ocultar hijos',

              // Agrupación de columnas
              groupingColumnHeaderName: 'Grupo',
              groupColumn: (name) => `Agrupar por ${name}`,
              unGroupColumn: (name) => `Dejar de agrupar por ${name}`,

              // Panel de detalle principal
              detailPanelToggle: 'Alternar panel de detalle',
              expandDetailPanel: 'Expandir',
              collapseDetailPanel: 'Colapsar',

              // Texto de reordenamiento de filas
              rowReorderingHeaderName: 'Reordenamiento de filas',

              // Texto de paginación
              MuiTablePagination: {
                labelRowsPerPage: 'Filas por página:',
                labelDisplayedRows: ({ from, to, count }) =>
                  `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
              },

              // Agregación
              aggregationMenuItemHeader: 'Agregación',
              aggregationFunctionLabelSum: 'suma',
              aggregationFunctionLabelAvg: 'promedio',
              aggregationFunctionLabelMin: 'mínimo',
              aggregationFunctionLabelMax: 'máximo',
              aggregationFunctionLabelSize: 'tamaño',
            }}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel);
            }}
            slots={{
              toolbar: () => (
                <GridToolbarContainer>
                  <GridToolbarQuickFilter />
                  <Stack
                    key="product-table-toolbar-actions"
                    spacing={1}
                    flexGrow={1}
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    {!!selectedRowIds.length && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                        onClick={confirmRows.onTrue}
                      >
                        Borrar ({selectedRowIds.length})
                      </Button>
                    )}

                    <GridToolbarColumnsButton />
                    <GridToolbarFilterButton />
                  </Stack>
                </GridToolbarContainer>
              ),
              noRowsOverlay: () => <EmptyContent title="No Data" />,
              noResultsOverlay: () => <EmptyContent title="No se encontraron resultados" />,
            }}
            slotProps={{
              columnsPanel: {
                getTogglableColumns,
              },
            }}
          />
        </Card>
      </Container>

      <Dialog open={addEditLibro.value} onClose={addEditLibro.onFalse} fullWidth>
        <DialogTitle>{currentLibro ? 'Editar Libro' : 'Agregar Libro'}</DialogTitle>
        <DialogContent>
          <ModalAddEditLibroForm
            close={addEditLibro.onFalse}
            refresh={fetchData}
            currentlibro={currentLibro}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={prestarLibro.value} onClose={prestarLibro.onFalse} fullWidth>
        <DialogTitle>Prestar Libro</DialogTitle>
        <DialogContent>
          <ModalPrestarLibroForm
            close={prestarLibro.onFalse}
            refresh={fetchData}
            currentlibro={currentLibro}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Borrar Libro"
        content={<>¿Estás seguro que quieres eliminar el {currentLibro?.titulo}?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow();
              confirmRows.onFalse();
            }}
          >
            Borrar
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData }) {
  return inputData;
}
