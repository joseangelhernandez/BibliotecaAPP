import PropTypes from 'prop-types';
import { m, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { MotionViewport } from 'src/components/animate';

import LibroItem from './libro-item';
import { LibroItemSkeleton } from './libro-skeleton';

// ----------------------------------------------------------------------

export default function LibroList({ libros, loading, ...other }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <LibroItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {libros.map((libro) => (
        <m.div
          layout
          initial="hidden"
          animate="show"
          exit="exit"
          variants={itemVariants}
          key={libro.inventarioId}
        >
          <LibroItem key={libro.inventarioId} libro={libro} />
        </m.div>
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        component={MotionViewport}
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        {...other}
      >
        <AnimatePresence>{loading ? renderSkeleton : renderList}</AnimatePresence>
      </Box>

      {libros.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

LibroList.propTypes = {
  loading: PropTypes.bool,
  libros: PropTypes.array,
};
