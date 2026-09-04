import { lazy, Suspense } from "react"
import { 
  RouterProvider,
  Route,
  createRoutesFromElements,
  createBrowserRouter
} from "react-router-dom"


const Layout = lazy(() => import("./pages/Layout"))
const Login = lazy(() => import("./pages/Login"))
const Marketplace = lazy(() => import("./components/Marketplace"))
const Descriptionpage = lazy(() => import("./components/Descriptionpage"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
  
function App() {

  const routes = createBrowserRouter(createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Marketplace />} />
        <Route path="item/:idno" element={<Descriptionpage />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="login" element={<Login />} />
    </Route>
  ))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={routes} />
    </Suspense>
  )
}

export default App
