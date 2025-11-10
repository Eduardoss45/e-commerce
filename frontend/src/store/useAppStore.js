import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAppStore = create(
  persist(
    (set, get) => ({
      user: null,
      verified: false,

      setAuth: userData =>
        set({
          user: userData,
          verified: !!userData?.verified,
        }),

      clearAuth: () => set({ user: null, verified: false, cart: [], favorites: [] }),

      isAuthenticated: () => !!get().user,

      fetchUserData: async () => {
        try {
          const res = await api.get('/auth/me');
          const user = res.data.user;
          console.log(user);
          set({
            user,
            cart: user?.cart || [],
            favorites: user?.favorites || [],
          });
        } catch (err) {
          console.error('Erro ao buscar usuário:', err);
        }
      },

      fetchUserProducts: async () => {
        const userId = get().user?._id;
        if (!userId) return;

        try {
          const [cartRes, favRes] = await Promise.all([
            api.get(`/user/${userId}/cart-products`),
            api.get(`/user/${userId}/favorite-products`),
          ]);

          set({
            cart: cartRes.data.products || [],
            favorites: favRes.data.favorites || [],
          });
        } catch (err) {
          console.error('Erro ao buscar dados completos:', err);
        }
      },

      cart: [],

      setCart: newCart => set({ cart: newCart }),

      addToCart: async item => {
        const cart = [...get().cart];
        const existingIndex = cart.findIndex(p => p.productId === item.productId);

        if (existingIndex !== -1) {
          cart[existingIndex] = { ...cart[existingIndex], quantity: item.quantity };
        } else {
          cart.push(item);
        }

        set({ cart });

        const id = get().user?._id;
        if (id) {
          try {
            const res = await api.post(`/user/${id}/add-item-cart`, {
              productId: item.productId,
              quantity: item.quantity,
            });
            set({ cart: res.data.cart });
          } catch (err) {
            console.error('Erro ao adicionar item:', err);
          }
        }
      },

      removeFromCart: async productId => {
        const id = get().user?._id;

        set({ cart: get().cart.filter(p => p.productId !== productId) });

        if (id) {
          try {
            const res = await api.post(`/user/${id}/remove-item-cart`, { productId });
            set({ cart: res.data.cart });
          } catch (err) {
            console.error('Erro ao remover item:', err);
          }
        }
      },

      clearCart: () => set({ cart: [] }),

      favorites: [],

      setFavorites: newFavorites => set({ favorites: newFavorites }),

      addToFavorites: async item => {
        const favorites = [...get().favorites];
        const exists = favorites.find(p => p.productId === item.productId);
        if (!exists) {
          favorites.push(item);
          set({ favorites });

          const id = get().user?._id;
          if (id) {
            try {
              await api.post(`/user/${id}/add-item-favorites`, { productId: item.productId });
            } catch (err) {
              console.error('Erro ao adicionar favorito:', err);
            }
          }
        }
      },

      removeFromFavorites: async productId => {
        const favorites = get().favorites.filter(p => p.productId !== productId);
        set({ favorites });

        const id = get().user?._id;
        if (id) {
          try {
            await api.post(`/user/${id}/remove-item-favorites`, { productId });
          } catch (err) {
            console.error('Erro ao remover favorito:', err);
          }
        }
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'app-storage',
      partialize: state => ({
        user: state.user
          ? {
              _id: state.user._id,
              email: state.user.email,
              verified: state.user.verified,
            }
          : null,
        cart: state.cart,
        favorites: state.favorites,
      }),
    }
  )
);
