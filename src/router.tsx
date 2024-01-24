import React, { Suspense } from "react"
import { Outlet, createBrowserRouter } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"

const SummaryPage = React.lazy(() => import('./pages/Summary/SummaryPage.tsx'))
const SetupPage = React.lazy(() => import('./pages/Setup/index.tsx'))

const AuthGuard = () => {

  return (
    <div>
      <Suspense fallback={<p>Loading ...</p>}>
        <Outlet />
      </Suspense>
    </div>
  )
}

const routes = createBrowserRouter([
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '',
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
            }
          }
        ]
      }
    ]
  }
])

export default routes