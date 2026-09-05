import { Outlet } from "react-router-dom"
import Nav from "../components/Nav"
import CartPage from "../components/Cart"
import { useFetchProducts } from "../../zustand/store"
import { useEffect } from "react"

function Layout() {

    const fetchProducts = useFetchProducts((s) => s.fetchProducts)

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return (
        <section className="bg-[#eef0f2]">
            <Nav />
            <CartPage />
            <section>
                <Outlet />
            </section>
        </section>
    )
}

export default Layout