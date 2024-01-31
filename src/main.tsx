import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './app/store.ts';
import './index.css';
import ThemeProviders from './providers/ThemeProviders.tsx';
import routes from './router.tsx';

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
