import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ThemeProvider } from '@mui/material/styles';

export const muiCache = createCache({
  key: 'mui',
  prepend: true,
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <CacheProvider value={muiCache}>
      <ThemeProvider theme={{}}>
        <App />

      </ThemeProvider>
     </CacheProvider>
  </React.StrictMode>,
)
