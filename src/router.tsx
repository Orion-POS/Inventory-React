import { Suspense } from "react"
import { Outlet, createBrowserRouter } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"

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
            index: true,
            element: <div>Summary Page</div>
          }
        ]
      }
    ]
  }
])

export default routes