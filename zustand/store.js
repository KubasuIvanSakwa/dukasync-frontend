import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchProducts } from "../api/api";

export const useCount = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    initAuth: () => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            set({ token: storedToken, user: JSON.parse(storedUser), isAuthenticated: true });
        }
    },

    login: async (user, token) => {
        // Update UI state immediately
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });

        const offlineCart = useAddToCart.getState().cart;

        if (offlineCart.length > 0) {
            const mappedItems = offlineCart.map(item => ({
                productId: item.id,
                quantity: item.quantity.toString()
            }));

            try {
                await fetch(`https://dukasync-backend-fvw3.onrender.com/api/v1/cart/${user._id}`, {
                    method: "POST", 
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    // Payload now matches your exact database schema
                    body: JSON.stringify({ 
                        user: user._id,
                        items: mappedItems 
                    })
                });
                
                console.log("Offline cart successfully synced to database!");
            } catch (error) {
                console.error("Failed to sync cart:", error);
            }
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    }
}));

export const useAddToCart = create()(
  persist(
    (set) => ({
      cart: [],

      // Adds a new item OR increments existing quantity
      addToCart: (product) =>
        set((state) => {
          const identifier = product.id || product.name;
          const existingItem = state.cart.find(
            (item) => (item.id || item.name) === identifier,
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                (item.id || item.name) === identifier
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          // If it's a new item, add it with a quantity of 1
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

      // Decrements quantity, and removes the item completely if it hits 0
      removeFromCart: (identifier) =>
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if ((item.id || item.name) === identifier) {
                return { ...item, quantity: item.quantity - 1 };
              }
              return item;
            })
            .filter((item) => item.quantity > 0), // Automatically clears out 0-quantity items
        })),

      // Instantly wipes the item entirely, regardless of quantity
      deleteFromCart: (identifier) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => (item.id || item.name) !== identifier,
          ),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: "cart" },
  ),
);

export const useToggleCart = create()(
  persist(
    (set) => ({
      toggle: false,
      toggleCart: () => set((state) => ({ toggle: !state.toggle })),
    }),
    { name: "toggle" },
  ),
);

export const useFetchProducts = create()(
  persist((set) => ({
    products: [],
    loading: false,
    errorM: "",
    fetchProducts: async () => {
      set({ loading: true });
      const Products = await fetchProducts();
      set({ products: Products.data, loading: false });
    },
}), { name: "products" }))