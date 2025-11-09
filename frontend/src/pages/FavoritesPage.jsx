import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import axios from 'axios';

const FavoritesPage = () => {
  const { favorites, user, removeFromFavorites, fetchUserProducts } = useAppStore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?._id) return;

      await fetchUserProducts();

      const productIds = favorites.map(f => f.productId);
      const responses = await Promise.all(
        productIds.map(id => axios.get(`https://dummyjson.com/products/${id}`))
      );
      setProducts(responses.map(r => r.data));
    };

    loadFavorites();
  }, [user?._id]);

  const handleRemove = async productId => {
    await removeFromFavorites(productId);
  };

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>Você ainda não adicionou favoritos ❤️</h2>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h2 className="favorites-title">Meus Favoritos</h2>
      <div className="favorites-grid">
        {favorites.map(item => {
          const product = products.find(p => String(p.id) === String(item.productId));

          return (
            <div key={item._id} className="favorite-card">
              {product ? (
                <>
                  <img
                    src={product.thumbnail || '/placeholder.png'}
                    alt={product.title}
                    className="favorite-img"
                  />
                  <div className="favorite-info">
                    <h3>{product.title}</h3>
                    <p>R$ {product.price}</p>
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

export default FavoritesPage;
