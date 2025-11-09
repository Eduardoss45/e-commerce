import { useManager } from '../hooks/useManager';
import Promotions from '../ui/Promotions';
import Banners from '../ui/Banners';
import NewProductsCard from '../ui/components/NewProductsCard';
import BestSellingProducts from '../ui/components/BestSellingProducts';

const Home = () => {
  const { data, error, loading } = useManager({});
  const productsPerBlock = 4;
  const numberOfBlocks = 5;
  if (loading)
    return (
      <div>
        <p>Carregando...</p>
      </div>
    );

  if (error)
    return (
      <div>
        <p>Desculpe tente novamente mais tarde!</p>
      </div>
    );

  return (
    <>
      <Banners />
      <div className="products-grid">
        <h2>Produtos Novos</h2>
        <div className="products-grid-container">
          {data.products.slice(4, 8).map(product => (
            <NewProductsCard
              key={product.id}
              id={product.id}
              thumbnail={product.images?.[0] || product.thumbnail || '/placeholder.png'}
              description={product.description}
              category={product.category}
              name={product.name || product.title}
              price={product.price}
              reviews={product.reviews}
            />
          ))}
        </div>
      </div>
      <Promotions />
      <div className="products-grid">
        <h2>Mais Vendidos</h2>
        {Array.from({ length: numberOfBlocks }).map((_, blockIndex) => {
          const start = 8 + blockIndex * productsPerBlock;
          const end = start + productsPerBlock;
          return (
            <div className="products-grid-container" key={blockIndex}>
              {data.products.slice(start, end).map(product => (
                <BestSellingProducts
                  key={product.id}
                  id={product.id}
                  thumbnail={product.thumbnail}
                  description={product.description}
                  category={product.category}
                  name={product.name || product.title}
                  price={product.price}
                  reviews={product.reviews}
                />
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
