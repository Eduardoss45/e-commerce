import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import axios from 'axios';
import ProductCardCompact from '../ui/components/ProductCardCompact';

const CartPage = () => {
  const { cart, user, addToCart, removeFromCart, fetchUserProducts } = useAppStore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      if (!user?._id || cart.length === 0) return;

      await fetchUserProducts();

      const productIds = cart.map(i => i.productId);
      const responses = await Promise.all(
        productIds.map(id => axios.get(`https://dummyjson.com/products/${id}`))
      );
      setProducts(responses.map(r => r.data));
    };

    loadCart();
  }, [user?._id, cart]);

  const handleIncrease = async (productId, quantity) => {
    await addToCart({ productId, quantity: quantity + 1 });
  };

  const handleDecrease = async (productId, quantity) => {
    if (quantity > 1) await addToCart({ productId, quantity: quantity - 1 });
  };

  const handleRemove = async productId => {
    await removeFromCart(productId);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Seu carrinho está vazio 😢</h2>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Meu Carrinho</h2>
      <div className="cart-grid">
        {cart.map(item => {
          const product = products.find(p => String(p.id) === String(item.productId));

          return (
            product && (
              <ProductCardCompact
                key={item.productId}
                product={product}
                quantity={item.quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            )
          );
        })}
      </div>
    </div>
  );
};

export default CartPage;
