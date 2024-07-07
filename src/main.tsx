import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './app/store.ts';
import './index.css';
import { ModalProvider } from './providers/ModalProvider.tsx';
import ThemeProviders from './providers/ThemeProviders.tsx';
import routes from './router.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ThemeProviders>
        <ModalProvider>
          <ReduxProvider store={store}>
            <RouterProvider router={routes} />
          </ReduxProvider>
        </ModalProvider>
      </ThemeProviders>
  </React.StrictMode>
);
