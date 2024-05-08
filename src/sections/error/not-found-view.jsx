import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import CompactLayout from 'src/layouts/compact';
import { PageNotFoundIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function NotFoundView() {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            ¡Lo siento, página no encontrada!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Lo siento, no pudimos encontrar la página que estás buscando. ¿Quizás has escrito mal la
            URL? Asegúrate de revisar la ortografía.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          Ir a la página de inicio
        </Button>
      </MotionContainer>
    </CompactLayout>
  );
}
