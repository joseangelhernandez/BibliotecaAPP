import { Helmet } from 'react-helmet-async';

import { LibroListView } from 'src/sections/inventario/view';

// ----------------------------------------------------------------------

export default function InventarioPage() {
  return (
    <>
      <Helmet>
        <title> Inventario Biblioteca</title>
      </Helmet>

      <LibroListView />
    </>
  );
}
