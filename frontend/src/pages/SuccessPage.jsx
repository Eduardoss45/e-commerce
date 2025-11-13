import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useAppStore();

  useEffect(() => {
    clearCart();
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [clearCart, navigate]);

  return (
    <div className="success-page">
      <h2>Pagamento realizado com sucesso! 🎉</h2>
      <p>Você será redirecionado para a página inicial em breve.</p>
    </div>
  );
};

export default SuccessPage;
