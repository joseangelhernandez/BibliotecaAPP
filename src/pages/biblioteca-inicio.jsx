import { Helmet } from 'react-helmet-async';

import { BibliotecaInicio } from 'src/sections/biblioteca-inicio/view';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> Inicio</title>
      </Helmet>

      <BibliotecaInicio />
    </>
  );
}
