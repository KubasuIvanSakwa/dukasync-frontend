import { lazy, Suspense, useEffect } from "react"
import { 
  RouterProvider,
  Route,
  createRoutesFromElements,
  createBrowserRouter
} from "react-router-dom"
import CheckoutPage from "./pages/CheckoutPage"
import { useAuthStore } from "../zustand/store"
import PrivateRoute from "./pages/PrivateRoute"
import OrdersPage from "./pages/OrdersPage"
import AdminRoute from "./pages/AdminRoute"


const Layout = lazy(() => import("./pages/Layout"))
const Login = lazy(() => import("./pages/Login"))
const Marketplace = lazy(() => import("./components/Marketplace"))
const Descriptionpage = lazy(() => import("./components/Descriptionpage"))
const Dashboard = lazy(() => import("./pages/Dashboard"))


function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
        initAuth();
    }, [initAuth]);

  const routes = createBrowserRouter(createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Marketplace />} />
        <Route path="item/:idno" element={<Descriptionpage />} />
        <Route element={<PrivateRoute />} > 
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Route>
      <Route path="auth" element={<Login />} />
    </Route>
  ))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={routes} />
    </Suspense>
  )
}

export default App
