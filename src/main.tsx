import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ThemeProvider as MaterialThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import routes from './router.tsx';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './app/store.ts';
import { theme } from './config/theme.ts';
import ThemeProviders from './providers/ThemeProviders.tsx';

export const muiCache = createCache({
  key: 'mui',
  prepend: true
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CacheProvider value={muiCache}>
      <ThemeProviders>
        <ReduxProvider store={store}>
          <RouterProvider router={routes} />
        </ReduxProvider>
      </ThemeProviders>
    </CacheProvider>
  </React.StrictMode>
);
