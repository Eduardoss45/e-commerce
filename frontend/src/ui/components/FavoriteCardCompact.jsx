import { useNavigate } from 'react-router-dom';
import { FaHeartBroken } from 'react-icons/fa';

const FavoriteCardCompact = ({ product, onRemove }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="favorite-card-compact" onClick={handleNavigate}>
      <div className="favorite-card-compact__image">
        <img src={product.thumbnail || '/placeholder.png'} alt={product.name} />
      </div>

      <div className="favorite-card-compact__content">
        <h3 className="favorite-card-compact__title">{product.name}</h3>
        <p className="favorite-card-compact__desc">
          {product.description?.slice(0, 80) || 'Sem descrição disponível.'}
        </p>

        <p className="favorite-card-compact__price">R$ {product.price}</p>

        <div className="favorite-card-compact__actions" onClick={e => e.stopPropagation()}>
          <button
            className="remove-btn"
            onClick={() => onRemove(product.id)}
            title="Remover dos favoritos"
          >
            <FaHeartBroken />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCardCompact;
