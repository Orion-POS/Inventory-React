import { Suspense } from "react"
import { Outlet } from "react-router-dom"

const MainLayout = () => {

  return (
    <div className="w-full bg-gray-300">
      <Suspense fallback={<p>Loading ...</p>}>

      </Suspense>
      <Outlet />
    </div>
  )
}

export default MainLayout