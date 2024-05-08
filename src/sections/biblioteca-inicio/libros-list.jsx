import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import LibroItem from './libro-item';
import { LibroItemSkeleton } from './libro-skeleton';

// ----------------------------------------------------------------------

export default function LibroList({ libros, loading, ...other }) {
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
        <LibroItem key={libro.inventarioId} libro={libro} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        {...other}
      >
        {loading ? renderSkeleton : renderList}
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
