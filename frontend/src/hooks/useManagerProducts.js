import api from '../services/api';
import { useCartStore } from '../store/useCartStore';

export function useManagerProducts() {
  const { setCart, cart } = useCartStore();

  async function addItem(userId, productId, quantity = 1) {
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

  async function removeItem(userId, productId) {
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

  return { addItem, removeItem };
}
