import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useProducts } from '../hooks/useProducts';
import axios from 'axios';
import FavoriteCardCompact from '../ui/components/FavoriteCardCompact';

const FavoritesPage = () => {
  const { favorites, user, fetchUserProducts } = useAppStore();
  const { removeFromFavorites } = useProducts();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?._id) return;

      await fetchUserProducts();

      if (favorites.length === 0) {
        setProducts([]);
        return;
      }

      const productIds = favorites.map(f => f.productId);
      const responses = await Promise.all(
        productIds.map(id => axios.get(`https://dummyjson.com/products/${id}`))
      );
      setProducts(responses.map(r => r.data));
    };

    loadFavorites();
  }, [user?._id, favorites.length]);

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
            product && (
              <FavoriteCardCompact key={item._id} product={product} onRemove={handleRemove} />
            )
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesPage;
