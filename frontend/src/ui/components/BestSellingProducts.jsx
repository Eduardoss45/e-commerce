import calcAverageRating from '../../utils/calcAverageRating';

const BestSellingProducts = ({ id, thumbnail, description, category, name, price, reviews }) => {
  const averageRating = calcAverageRating(reviews);
  return (
    <div id={id} className="products-grid-card">
      <span className="label hot">Hot</span>
      <img src={thumbnail} alt={description} />
      <p className="category">{category}</p>
      <h3 className="product-name">{name}</h3>
      <p className="product-price">R$ {price}</p>
      <div className="rating-box">
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} className={i < averageRating ? 'fas fa-star' : 'far fa-star'}></i>
        ))}
      </div>
      <button className="btn">Comprar</button>
    </div>
  );
};

export default BestSellingProducts;
