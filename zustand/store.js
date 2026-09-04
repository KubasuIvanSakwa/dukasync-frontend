import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCount = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1})),
    decrement: () => set((state) => ({ count: state.count - 1}))
}))


export const useAddToCart = create()(persist((set) => ({
    cart: [],
    
    // Adds a new item OR increments existing quantity
    addToCart: (product) => set((state) => {
        const identifier = product.id || product.name;
        const existingItem = state.cart.find(item => (item.id || item.name) === identifier);

        if (existingItem) {
            return {
                cart: state.cart.map(item => 
                    (item.id || item.name) === identifier 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                )
            };
        }
        // If it's a new item, add it with a quantity of 1
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),
    
    // Decrements quantity, and removes the item completely if it hits 0
    removeFromCart: (identifier) => set((state) => ({
        cart: state.cart.map(item => {
            if ((item.id || item.name) === identifier) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        }).filter(item => item.quantity > 0) // Automatically clears out 0-quantity items
    })),

    // Instantly wipes the item entirely, regardless of quantity
    deleteFromCart: (identifier) => set((state) => ({
        cart: state.cart.filter(item => (item.id || item.name) !== identifier)
    }))

}), { name: 'cart' }));

export const useToggleCart = create()(persist((set) => ({
    toggle: false,
    toggleCart: () => set((state) => ({ toggle: !state.toggle}))
}), {name: 'toggle'}))