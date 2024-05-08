import { Helmet } from 'react-helmet-async';

import { UsuariosListView } from 'src/sections/usuario/view';

// ----------------------------------------------------------------------

export default function UsuariosPage() {
  return (
    <>
      <Helmet>
        <title> Usuarios Biblioteca</title>
      </Helmet>

      <UsuariosListView />
    </>
  );
}
