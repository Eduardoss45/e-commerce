import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      setCart: newCart => set({ cart: newCart }),
      addToCart: item => {
        const exists = get().cart.find(p => p.productId === item.productId);
        if (exists) {
          exists.quantity += item.quantity;
          set({ cart: [...get().cart] });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },
      removeFromCart: productId => {
        set({ cart: get().cart.filter(p => p.productId !== productId) });
      },
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
