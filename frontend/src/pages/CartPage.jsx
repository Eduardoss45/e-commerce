import { useCartStore } from '../store/useCartStore';
import { useManagerProducts } from '../hooks/useManagerProducts';

const CartPage = () => {
  const { cart } = useCartStore();
  const { removeItem, addItem } = useManagerProducts();

  console.log(cart);

  const handleIncrease = async (userId, productId, quantity) => {
    await addItem(userId, productId, quantity + 1);
  };

  const handleDecrease = async (userId, productId, quantity) => {
    if (quantity > 1) await addItem(userId, productId, quantity - 1);
  };

  const handleRemove = async (userId, productId) => {
    await removeItem(userId, productId);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Seu carrinho está vazio 😢</h2>
      </div>
    );
  }

  // Exemplo estático de userId (substitua por auth)
  const userId = 'USER123';

  return (
    <div className="cart-page">
      <h2 className="cart-title">Meu Carrinho</h2>

      <div className="cart-grid">
        {cart.map(item => {
          const product = item.product || {};
          const price = product.price || 0;
          const total = (price * item.quantity).toFixed(2);

          return (
            <div className="cart-card" key={item._id}>
              <img
                src={product.thumbnail || '/placeholder.png'}
                alt={product.name}
                className="cart-img"
              />

              <div className="cart-info">
                <h3 className="cart-name">{product.name}</h3>
                <p className="cart-price">R$ {price}</p>

                <div className="cart-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => handleDecrease(userId, product._id, item.quantity)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => handleIncrease(userId, product._id, item.quantity)}
                  >
                    +
                  </button>
                </div>

                <p className="cart-total">Subtotal: R$ {total}</p>

                <button className="remove-btn" onClick={() => handleRemove(userId, product._id)}>
                  Remover
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartPage;
