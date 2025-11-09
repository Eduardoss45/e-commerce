import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useManager } from '../hooks/useManager';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { id } = useParams();
  const { cart, favorites, user } = useAppStore();
  const { addItemToCart, removeItemFromCart, addItemToFavorites, removeItemFromFavorites } =
    useProducts();
  const { data, loading, error } = useManager({});
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Busca produto pelo ID
  useEffect(() => {
    if (data?.products) {
      const found = data.products.find(p => String(p.id) === id);
      setProduct(found);
    }
  }, [data, id]);

  // Verifica se está no carrinho
  useEffect(() => {
    const exists = cart.some(
      item => String(item.product?._id) === id || String(item.productId) === id
    );
    setIsInCart(exists);
  }, [cart, id]);

  // Verifica se está nos favoritos
  useEffect(() => {
    const exists = favorites?.some(
      item => String(item.product?._id) === id || String(item.productId) === id
    );
    setIsFavorite(exists);
  }, [favorites, id]);

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
        await removeItemFromCart(user._id, productId);
        toast.success('Produto removido do carrinho.');
      } else {
        await addItemToCart(user._id, productId, 1);
        toast.success('Produto adicionado ao carrinho.');
      }
    } catch (err) {
      toast.error('Ocorreu um erro ao atualizar o carrinho.');
      console.error(err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user?._id) {
      toast.info('Você precisa estar logado para adicionar aos favoritos.');
      return;
    }

    const productId = Number(id);
    if (isNaN(productId)) {
      toast.error('ID de produto inválido.');
      return;
    }

    try {
      if (isFavorite) {
        await removeItemFromFavorites(user._id, productId);
        setIsFavorite(false);
        toast.success('Produto removido dos favoritos.');
      } else {
        await addItemToFavorites(user._id, productId);
        setIsFavorite(true);
        toast.success('Produto adicionado aos favoritos.');
      }
    } catch (err) {
      toast.error('Ocorreu um erro ao atualizar os favoritos.');
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
        <div className="product-header">
          <div>
            <h2>{title}</h2>
          </div>
          <div
            className="favorite-icon"
            onClick={handleToggleFavorite}
            style={{ cursor: 'pointer' }}
          >
            {isFavorite ? <i className="fas fa-star"></i> : <i className="far fa-star"></i>}
          </div>
        </div>

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

        <div className="extra-info">
          <p>
            <strong>Estoque:</strong> {stock} unidades
          </p>
          <p>
            <strong>Classificação:</strong> {rating?.toFixed(1) || 0}{' '}
            <i className="fas fa-star"></i>
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
                <strong>{r.reviewerName}</strong> ({r.rating}
                <i className="fas fa-star"></i>)<p>{r.comment}</p>
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
