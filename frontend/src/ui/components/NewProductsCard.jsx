import { useNavigate } from 'react-router-dom';
import calcAverageRating from '../../utils/calcAverageRating';

const ProductCard = ({ id, thumbnail, description, category, name, price, reviews }) => {
  const navigate = useNavigate();
  const averageRating = calcAverageRating(reviews);

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="products-grid-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <span className="label new">New</span>
      <img src={thumbnail} alt={description} />
      <p className="category">{category}</p>
      <h3 className="product-name">{name}</h3>
      <p className="product-price">R$ {price}</p>
      <div className="rating-box">
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} className={i < averageRating ? 'fas fa-star' : 'far fa-star'}></i>
        ))}
      </div>
      <button
        className="btn"
        onClick={e => {
          e.stopPropagation();
          alert('Adicionar ao carrinho');
        }}
      >
        Comprar
      </button>
    </div>
  );
};

export default ProductCard;
