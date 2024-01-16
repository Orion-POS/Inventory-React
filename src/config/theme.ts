import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1FC6BC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#16A5AA',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#84CC16',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FECACA',
      contrastText: '#EF4444',
    },
    warning: {
      main: '#FDE68A',
      contrastText: '#F59E0B',
    },
  },
});