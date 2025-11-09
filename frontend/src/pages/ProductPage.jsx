import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useManagerProducts } from '../hooks/useManagerProducts';
import { useManager } from '../hooks/useManager';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { id } = useParams();
  const { cart } = useCartStore();
  const { addItem, removeItem } = useManagerProducts();
  const { user } = useAuthStore();
  const { data, loading, error } = useManager({});
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isInCart, setIsInCart] = useState(false);

  // Carrega produto específico
  useEffect(() => {
    if (data?.products) {
      const found = data.products.find(p => String(p.id) === id);
      setProduct(found);
    }
  }, [data, id]);

  useEffect(() => {
    const exists = cart.some(
      item => String(item.product?._id) === id || String(item.productId) === id
    );
    setIsInCart(exists);
  }, [cart, id]);

  if (loading) return <p>Carregando produto...</p>;
  if (error) return <p>Erro ao carregar produto.</p>;
  if (!product) return <p>Produto não encontrado.</p>;

  const handleToggleCart = async () => {
    if (!user?._id) {
      toast.info('Você precisa estar logado para adicionar ao carrinho.');
      return;
    }

    const productId = Number(id);
    if (isNaN(productId)) {
      toast.error('ID de produto inválido.');
      return;
    }

    try {
      if (isInCart) {
        await removeItem(user._id, productId);
        toast.success('Produto removido do carrinho.');
      } else {
        await addItem(user._id, productId, 1);
        toast.success('Produto adicionado ao carrinho.');
      }
    } catch (err) {
      toast.error('Ocorreu um erro ao atualizar o carrinho.');
      console.error(err);
    }
  };

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
      {/* Galeria de imagens */}
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

      {/* Detalhes do produto */}
      <div className="product-details">
        <h2>{title}</h2>
        <p className="brand">
          {brand} — {category}
        </p>

        <div className="price">
          <span className="current-price">R$ {finalPrice}</span>
          {discountPercentage > 0 && <span className="old-price">R$ {price.toFixed(2)}</span>}
        </div>

        <div className="btn-container">
          <button className="frete-btn">
            <i className="fas fa-shipping-fast"></i> Calcular frete
          </button>

          <button className="buy-btn" onClick={handleToggleCart}>
            <i className="fas fa-shopping-cart"></i>{' '}
            {isInCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
          </button>
        </div>

        <p className="description">{description}</p>

        {/* Informações adicionais */}
        <div className="extra-info">
          <p>
            <strong>Estoque:</strong> {stock} unidades
          </p>
          <p>
            <strong>Classificação:</strong> {rating?.toFixed(1) || 0} ⭐
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

        {/* Avaliações */}
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