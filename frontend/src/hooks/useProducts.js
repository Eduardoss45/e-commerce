import api from '../services/api';
import { useAppStore } from '../store/useAppStore';

export function useProducts() {
  const { setCart, setFavorites, cart, favorites } = useAppStore();

  async function addItemToCart(userId, productId, quantity = 1) {
    try {
      const res = await api.post(`/user/${userId}/add-item-cart`, {
        productId,
        quantity,
      });
      setCart(res.data.cart);
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      throw err;
    }
  }

  async function removeItemFromCart(userId, productId) {
    try {
      const itemInCart = cart.find(item => String(item.productId) === String(productId));

      if (!itemInCart) {
        console.error('Produto não encontrado no carrinho.');
        return;
      }

      const res = await api.post(`/user/${userId}/remove-item-cart`, {
        cartItemId: itemInCart._id,
      });

      setCart(res.data.cart);
    } catch (err) {
      console.error('Erro ao remover item:', err);
      throw err;
    }
  }

  async function addItemToFavorites(userId, productId) {
    try {
      const res = await api.post(`/user/${userId}/add-item-favorites`, {
        productId,
      });
      setFavorites(res.data.favorites);
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      throw err;
    }
  }

  async function removeItemFromFavorites(userId, productId) {
    try {
      const itemInFavorites = favorites.find(item => String(item.productId) === String(productId));

      if (!itemInFavorites) {
        console.error('Produto não encontrado nos favoritos.');
        return;
      }

      const res = await api.post(`/user/${userId}/remove-item-favorites`, {
        favoriteItemId: itemInFavorites._id,
      });

      setFavorites(res.data.favorites);
    } catch (err) {
      console.error('Erro ao remover item:', err);
      throw err;
    }
  }

  return { addItemToCart, removeItemFromCart, addItemToFavorites, removeItemFromFavorites };
}
