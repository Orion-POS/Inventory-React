import React, { Suspense } from 'react';
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Assets from './pages/Assets/Assets.tsx';
import ItemCategory from './pages/Setup/ItemCategory.tsx';
import ItemLibraries from './pages/Setup/ItemLibraries.tsx';
import TransactionType from './pages/Setup/TransactionType.tsx';
import UoMCategory from './pages/Setup/UoMCategory.tsx';
import Adjustment from './pages/stock-management/Adjustment.tsx';
import StockOpname from './pages/stock-management/StockOpname.tsx';
import UsedStcok from './pages/stock-management/UsedStock.tsx';
import WastedStock from './pages/stock-management/WastedStock.tsx';
import Suppliers from './pages/Suppliers/Suppliers.tsx';
import Transaction from './pages/Transaction/Transaction.tsx';

const SummaryPage = React.lazy(() => import('./pages/Summary/SummaryPage.tsx'));
const SetupPage = React.lazy(() => import('./pages/Setup/index.tsx'));
const SetupItemCategoryPage = React.lazy(() => import('./pages/Setup/index.tsx'));
const StockRecap = React.lazy(() => import('./pages/Summary/StockRecap/StockRecap.tsx'));

const AuthGuard = () => {
  return (
    <Suspense fallback={<p>Loading ...</p>}>
      <Outlet />
    </Suspense>
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

                element: <UoMCategory />,
                handle: {
                  crumb: () => 'UoM Category'
                }
              },
              {
                path: 'item-libraries',

                element: <ItemLibraries />,
                handle: {
                  crumb: () => 'Item Libraries'
                }
              },
              {
                path: 'transaction-type',

                element: <TransactionType />,
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
            path: 'stock-management',
            // element: <SetupPage />,
            handle: {
              crumb: () => 'Stock Management'
            },
            children: [
              {
                path: '',
                element: <Navigate to={'used-stock'} />
              },
              {
                path: 'used-stock',

                element: <UsedStcok />,
                handle: {
                  crumb: () => 'Used Stock'
                }
              },
              {
                path: 'adjustment',

                element: <Adjustment />,
                handle: {
                  crumb: () => 'Adjustment'
                }
              },
              {
                path: 'stock-opname',

                element: <StockOpname />,
                handle: {
                  crumb: () => 'Stock Opname'
                }
              },
              {
                path: 'wasted-stock',

                element: <WastedStock />,
                handle: {
                  crumb: () => 'Wasted Stock'
                }
              },
              {
                path: '*',
                element: <Navigate to={'stock-management'} />
              }
            ]
          },
          {
            path: 'transaction',
            element: <Transaction />,
            handle: {
              crumb: () => 'Transaction'
            }
          },
          {
            path: 'suppliers',
            element: <Suppliers />,
            handle: {
              crumb: () => 'Suppliers'
            }
          },
          {
            path: 'assets',
            element: <Assets />,
            handle: {
              crumb: () => 'Assets'
            }
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
  }
]);

export default routes;
