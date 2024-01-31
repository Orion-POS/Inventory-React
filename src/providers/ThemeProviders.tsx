import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ReactNode } from 'react';
import { emotionTheme } from '../config/theme';

const ThemeProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    // <MaterialThemeProvider theme={materialTheme}>
    <EmotionThemeProvider theme={emotionTheme}>{children}</EmotionThemeProvider>
    // </MaterialThemeProvider>
  );
};

export default ThemeProviders;
