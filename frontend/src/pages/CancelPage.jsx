import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/cart');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="cancel-page">
      <h2>Pagamento cancelado. 😔</h2>
      <p>Você será redirecionado para o carrinho em breve.</p>
    </div>
  );
};

export default CancelPage;
