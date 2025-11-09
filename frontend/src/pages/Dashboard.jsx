import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const Dashboard = () => {
  const { user, fetchUserData, removeItemFromCart } = useAppStore();

  useEffect(() => {
    if (!user?._id) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  const handleRemove = async cartItemId => {
    await removeItemFromCart(cartItemId);
  };

  return (
    <section className="client-dashboard">
      <h2>Meu Carrinho</h2>

      {user?.cart?.length === 0 ? (
        <p className="empty-cart">Seu carrinho está vazio 😔</p>
      ) : (
        <div className="cart-grid">
          {user?.cart?.map(item => (
            <div className="cart-card" key={item._id}>
              <img
                src={item.product?.image || '/images/no-image.png'}
                alt={item.product?.name || 'Produto'}
              />
              <div className="cart-info">
                <h3>{item.product?.name || 'Produto sem nome'}</h3>
                <p className="price">R$ {item.product?.price?.toFixed(2) || '0,00'}</p>
                <p className="quantity">Quantidade: {item.quantity}</p>
              </div>
              <button className="btn remove-btn" onClick={() => handleRemove(item._id)}>
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Dashboard;
