import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import axios from 'axios';

const CartPage = () => {
  const { cart, user, addToCart, removeFromCart, fetchUserProducts } = useAppStore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      if (!user?._id) return;

      await fetchUserProducts();

      const productIds = cart.map(i => i.productId);
      const responses = await Promise.all(
        productIds.map(id => axios.get(`https://dummyjson.com/products/${id}`))
      );
      setProducts(responses.map(r => r.data));
    };

    loadCart();
  }, [user?._id]);

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
          const total = product ? (product.price * item.quantity).toFixed(2) : '0.00';

          return (
            <div className="cart-card" key={item._id}>
              {product ? (
                <>
                  <img
                    src={product.thumbnail || '/placeholder.png'}
                    alt={product.title}
                    className="cart-img"
                  />
                  <div className="cart-info">
                    <h3>{product.title}</h3>
                    <p>R$ {product.price}</p>

                    <div className="cart-quantity">
                      <button onClick={() => handleDecrease(product.id, item.quantity)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleIncrease(product.id, item.quantity)}>+</button>
                    </div>

                    <p className="cart-total">Subtotal: R$ {total}</p>
                    <button onClick={() => handleRemove(product.id)}>Remover</button>
                  </div>
                </>
              ) : (
                <p>Carregando...</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartPage;
