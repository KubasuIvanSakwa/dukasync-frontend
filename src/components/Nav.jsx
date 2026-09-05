import CartLogo from "../assets/cart.svg";
import Prod from "../assets/product.svg";
import Logo from "../assets/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { useAddToCart, useAuthStore, useToggleCart } from "../../zustand/store";
// import Dashboard from "./Dashboard";

function Nav() {
  // const [hov, setHov] = useState(false);
  // const [cartCount, setCartCount] = useState(0);

  const cartCount = useAddToCart(({ cart }) => cart);
  const toggleCart = useToggleCart((s) => s.toggleCart);
  const logOut = useAuthStore((s) => s.logout);
  const user = useAuthStore(({ user }) => user);

  const param = useLocation();
  console.log(param);

  // Update the cart count when the component mounts
  // useEffect(() => {
  //   const cart = JSON.parse(localStorage.getItem("cart")) || [];
  //   setCartCount(cart.length);
  // }, []); // Empty dependency array means this runs only once when the component mounts

  return (
    <nav className="flex items-center justify-center flex-col mx-auto space-x-2 pt-3 p-2">
      {!param.pathname.includes("dashboard") && (
        <Link
          className="text-3xl font-extralight pl-2 flex items-center"
          to="/"
        >
          <span className="text-green-500 font-extrabold">S</span>H
          <span className="w-[1.6rem]">
            <img src={Logo} alt="O" className="w-[1.6rem]" />
          </span>
          P
        </Link>
      )}
      {param.pathname === "/" && (
        <div className="flex items-center max-w-sm mx-auto space-x-2 pt-3 p-2">
          <div className="relative w-full flex">
            <div className="absolute flex h-full  items-center pointer-events-none overflow-hidden w-8 justify-center pl-0.5">
              <img src={Prod} alt="S" className="pr-1 pl-1" />
            </div>
            <input
              type="text"
              id="simple-search"
              placeholder="Search ..."
              // onChange={(e) => setSearch(e.target.value)}
              required
              className="px-3 py-2.5 rounded-xl bg-gray-300 border border-gray-400 rounded-base ps-9 text-heading text-sm focus:outline-1 block w-full placeholder:text-black/40"
            />
          </div>
          <button
            // onClick={(e) => {
            //     e.preventDefault()
            //     if (search) {setParam(search)}
            //     else console.log("no search text")
            // }}
            className="inline-flex items-center justify-center shrink-0 text-white bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-xl focus:ring-4 focus:ring-brand-medium shadow-xs rounded-base w-10 h-10 focus:outline-none"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
          <div className="relative cursor-pointer" onClick={() => toggleCart()}>
            <img src={CartLogo} alt="S" className="w-[5rem] h-[3rem]" />
            <span className="bg-green-500 w-5 h-5 inline-flex absolute text-sm -top-2 right-0 border-[0.1rem] border-white rounded-full justify-center items-center p-3 text-white font-bold">
              {cartCount.length || 0}
            </span>
          </div>
          {user ? (
            user.role === "admin" ? (
              <button
                className="w-[9rem] p-1 rounded-lg border border-black/20 hover:bg-gray-300"
                onClick={() => (window.location = "/dashboard")}
              >
                Dashboard
              </button>
            ) : (
              <button
                className="w-[9rem] p-1 rounded-lg border border-black/20 hover:bg-gray-300"
                onClick={() => logOut()}
              >
                Log out
              </button>
            )
          ) : (
            <button
              className="w-[10rem] p-1 rounded-lg border border-black/20 hover:bg-gray-300"
              onClick={() => (window.location = "/auth")}
            >
              Log In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Nav;
