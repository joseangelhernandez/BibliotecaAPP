import { Helmet } from 'react-helmet-async';

import { PrestamosListView } from 'src/sections/prestamos/view';

// ----------------------------------------------------------------------

export default function PrestamosPage() {
  return (
    <>
      <Helmet>
        <title> Biblioteca: Prestamos</title>
      </Helmet>

      <PrestamosListView />
    </>
  );
}
