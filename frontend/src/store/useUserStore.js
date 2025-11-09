import { create } from 'zustand';
import axios from 'axios';

export const useUserStore = create((set, get) => ({
  user: null,

  fetchUserData: async () => {
    try {
      const id = localStorage.getItem('userId');
      const res = await axios.get(`/api/users/${id}`);
      set({ user: res.data.user });
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
    }
  },

  removeItemFromCart: async cartItemId => {
    try {
      const id = localStorage.getItem('userId');
      const res = await axios.post(`/api/users/${id}/cart/remove`, {
        cartItemId,
      });
      set(state => ({ user: { ...state.user, cart: res.data.cart } }));
    } catch (err) {
      console.error('Erro ao remover item:', err);
    }
  },
}));
