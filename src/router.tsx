import React, { Suspense } from 'react';
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ItemCategory from './pages/Setup/ItemCategory.tsx';

const SummaryPage = React.lazy(() => import('./pages/Summary/SummaryPage.tsx'));
const SetupPage = React.lazy(() => import('./pages/Setup/index.tsx'));
const SetupItemCategoryPage = React.lazy(() => import('./pages/Setup/index.tsx'));
const StockRecap = React.lazy(() => import('./pages/Summary/StockRecap/StockRecap.tsx'));

const AuthGuard = () => {
  return (
    <div>
      <Suspense fallback={<p>Loading ...</p>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

const routes = createBrowserRouter([
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: 'summary',
            element: <SummaryPage />,
            handle: {
              crumb: () => 'summary'
            }
          },
          {
            path: 'setup',
            element: <SetupPage />,
            handle: {
              crumb: () => 'setup'
            },
            children: [
              {
                path: '',
                element: <Navigate to={'item-category'} />
              },
              {
                path: 'item-category',

                element: <ItemCategory />,
                handle: {
                  crumb: () => 'Item Category'
                }
              },
              {
                path: 'uom-category',

                element: <ItemCategory />,
                handle: {
                  crumb: () => 'Item Category'
                }
              },
              {
                path: 'item-libraries',

                element: <ItemCategory />,
                handle: {
                  crumb: () => 'Item Libraries'
                }
              },
              {
                path: 'transaction-type',

                element: <ItemCategory />,
                handle: {
                  crumb: () => 'Transaction Type'
                }
              },
              {
                path: '*',
                element: <Navigate to={'item-category'} />
              }
            ]
          },
          {
            path: 'stock-recap',
            element: <StockRecap />,
            handle: {
              crumb: () => 'Stock Recap'
            }
          }
        ]
      },
      {
        path: '',
        element: <Navigate to={'summary'} />
      }
    ]
  },
]);

export default routes;
