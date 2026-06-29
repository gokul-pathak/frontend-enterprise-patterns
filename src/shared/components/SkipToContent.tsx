import { Box } from '@mui/material';

export function SkipToContent() {
  return (
    <Box
      component="a"
      href="#main-content"
      sx={{
        position: 'absolute',
        top: -9999,
        left: -9999,
        zIndex: 9999,
        padding: 2,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        textDecoration: 'none',
        fontWeight: 'bold',
        '&:focus': {
          top: 0,
          left: 0,
        },
      }}
    >
      Skip to content
    </Box>
  );
}
