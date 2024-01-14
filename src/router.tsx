import { Suspense } from "react"
import { Outlet } from "react-router-dom"

const AuthGuard = () => {

  return (
    <div>
      <Suspense fallback={<p>Loading ...</p>}>
        <Outlet />
      </Suspense>
    </div>
  )
}