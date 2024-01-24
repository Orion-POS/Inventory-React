import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ThemeProvider as MaterialThemeProvider } from '@mui/material';
import { emotionTheme, materialTheme } from '../config/theme';
import { ReactNode } from 'react';

const ThemeProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <MaterialThemeProvider theme={materialTheme}>
      <EmotionThemeProvider theme={emotionTheme}>{children}</EmotionThemeProvider>
    </MaterialThemeProvider>
  );
};

export default ThemeProviders;
