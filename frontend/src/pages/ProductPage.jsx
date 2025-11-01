import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProducts } from '../hooks/useGetProducts'; // se você já tem esse hook
import calcAverageRating from '../utils/calcAverageRating';

const ProductPage = () => {
  const { id } = useParams(); // pega o ID da URL
  const { data, loading, error } = useGetProducts({}); // pega todos os produtos
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (data?.products) {
      const found = data.products.find(p => String(p.id) === id);
      setProduct(found);
    }
  }, [data, id]);

  if (loading) return <p>Carregando produto...</p>;
  if (error) return <p>Erro ao carregar produto.</p>;
  if (!product) return <p>Produto não encontrado.</p>;

  const {
    title,
    description,
    price,
    discountPercentage,
    brand,
    category,
    images,
    rating,
    stock,
    reviews,
    weight,
    dimensions,
    warrantyInformation,
    returnPolicy,
  } = product;

  const finalPrice = (price - (price * discountPercentage) / 100).toFixed(2);

  return (
    <div className="product-page">
      <div className="product-gallery">
        <img src={images?.[currentImage]} alt={title} className="product-main-image" />
        <div className="product-thumbnails">
          {images?.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${title} ${idx + 1}`}
              onClick={() => setCurrentImage(idx)}
              className={currentImage === idx ? 'active' : ''}
            />
          ))}
        </div>
      </div>

      <div className="product-details">
        <h2>{title}</h2>
        <p className="brand">
          {brand} — {category}
        </p>

        <div className="price">
          <span className="current-price">R$ {finalPrice}</span>
          {discountPercentage > 0 && <span className="old-price">R$ {price.toFixed(2)}</span>}
        </div>

        <p className="description">{description}</p>

        <button className="buy-btn">🛒 Adicionar ao carrinho</button>

        <div className="extra-info">
          <p>
            <strong>Estoque:</strong> {stock} unidades
          </p>
          <p>
            <strong>Classificação:</strong> {rating.toFixed(1)} ⭐
          </p>
          <p>
            <strong>Peso:</strong> {weight}g
          </p>
          <p>
            <strong>Dimensões:</strong> {dimensions.width}x{dimensions.height}x{dimensions.depth} cm
          </p>
          <p>
            <strong>Garantia:</strong> {warrantyInformation}
          </p>
          <p>
            <strong>Política de devolução:</strong> {returnPolicy}
          </p>
        </div>

        <div className="reviews">
          <h3>Avaliações</h3>
          {reviews?.length ? (
            reviews.map((r, i) => (
              <div key={i} className="review">
                <strong>{r.reviewerName}</strong> ({r.rating}⭐)
                <p>{r.comment}</p>
              </div>
            ))
          ) : (
            <p>Sem avaliações ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
