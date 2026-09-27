import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#4f46e5',
    },
    background: {
      default: '#f8fafc',
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily:
      '"Inter","Segoe UI",sans-serif',
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            '0 6px 24px rgba(0,0,0,0.08)',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
