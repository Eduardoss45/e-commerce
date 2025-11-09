import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const cartCount = cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    clearAuth();
    navigate('/'); // opcional: volta pra home ao sair
  };

  return (
    <header className="header">
      {/* 🔹 Topo */}
      <div className="header-top">
        <div className="header-top-container">
          <div className="store-info-container">
            <span>
              <i className="fas fa-phone"></i> (48) 99999-0000
            </span>
            <span>
              <i className="far fa-envelope"></i> electron@email.com
            </span>
            <span>
              <i className="fas fa-map-marker-alt"></i> Rua Teste, 1234
            </span>
          </div>

          <div className="header-user-top-menu">
            <span>
              <i className="fas fa-dollar-sign"></i> <a href="#">BRL</a>
            </span>

            <span className="user-menu">
              <i className="fas fa-user"></i>{' '}
              {loggedIn ? (
                <>
                  <Link to="/user-account" className="user-link">
                    {user?.email || 'Minha Conta'}
                  </Link>
                  <span className="divider">|</span>
                  <button onClick={handleLogout} className="logout-link">
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  {location.pathname !== '/register' && (
                    <>
                      <span className="divider">|</span>
                      <Link to="/register">Registre-se</Link>
                    </>
                  )}
                </>
              )}
            </span>
          </div>
        </div>
      </div>
      
      <div className="main-header">
        <div className="main-header-container">
          <Link to="/" id="brand">
            Electron <i className="fas fa-bolt"></i>
          </Link>

          <form id="search-form">
            <input type="text" id="search" placeholder="Busque aqui" />
            <input type="submit" className="btn btn-half" value="Pesquisar" />
          </form>

          <div className="header-actions-menu">
            <div className="wishlist-container">
              <span className="qty">0</span>
              <i className="far fa-heart"></i>
              <a href="#">Favoritos</a>
            </div>

            <div className="header-cart-container">
              <span className="qty">{cartCount}</span>
              <i className="fas fa-shopping-cart"></i>
              <Link to="/cart">Carrinho</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Menu inferior */}
      <div className="header-bottom">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <a href="#">Promoções</a>
            </li>
            <li>
              <a href="#">Notebooks</a>
            </li>
            <li>
              <a href="#">Celulares</a>
            </li>
            <li>
              <a href="#">Câmeras</a>
            </li>
            <li>
              <a href="#">Acessórios</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
