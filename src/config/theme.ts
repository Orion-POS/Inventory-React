import { Theme } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

export const materialTheme = createTheme({
  palette: {
    primary: {
      main: '#1FC6BC',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#16A5AA',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#84CC16',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#FECACA',
      contrastText: '#EF4444'
    },
    warning: {
      main: '#FDE68A',
      contrastText: '#F59E0B'
    }
  }
});

export const emotionTheme: Theme = {
  colors: {
    brand: '#1FC6BC',
    primary: {
      50: '#F5FFFE',
      100: '',
      200: '',
      300: '',
      400: '',
      500: '#1FC6BC',
      600: '',
      700: '',
      800: '',
      900: ''
    },
    base: {
      black: '#080600',
      white: '',
      gray: {
        light: '',
        medium: '',
        darker: '',
        dark: ''
      }
    }
  }
};
