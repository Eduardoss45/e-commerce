import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa';

const ProductCardCompact = ({ product, quantity, onIncrease, onDecrease, onRemove }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card-compact" onClick={handleNavigate}>
      <div className="product-card-compact__image">
        <img src={product.thumbnail || '/placeholder.png'} alt={product.name} />
      </div>

      <div className="product-card-compact__content">
        <h3 className="product-card-compact__title">{product.name}</h3>
        <p className="product-card-compact__desc">
          {product.description?.slice(0, 80) || 'Sem descrição disponível.'}
        </p>

        <p className="product-card-compact__price">R$ {product.price}</p>

        <div className="product-card-compact__actions" onClick={e => e.stopPropagation()}>
          <div className="quantity-control">
            <button className="qty-btn" onClick={() => onDecrease(product.id, quantity)}>
              <FaMinus />
            </button>
            <span>{quantity}</span>
            <button className="qty-btn" onClick={() => onIncrease(product.id, quantity)}>
              <FaPlus />
            </button>
          </div>

          <button
            className="remove-btn"
            onClick={() => onRemove(product.id)}
            title="Remover do carrinho"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardCompact;
