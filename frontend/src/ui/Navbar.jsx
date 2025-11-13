import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const electronicCategories = [
  'smartphones',
  'laptops',
  'mobile-accessories',
  'tablets',
  'mens-watches',
  'womens-watches',
];

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, clearAuth, cart, favorites } = useAppStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const cartCount = cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
  const favoritesCount = favorites?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  useEffect(() => {
    const handler = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 2) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const performSearch = async (query) => {
    setLoadingSearch(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_SUPPLIER_URL}/search?q=${query}`);
      const filteredProducts = response.data.products.filter(product =>
        electronicCategories.includes(product.category)
      );
      setSearchResults(filteredProducts);
      setShowDropdown(true);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  return (
    <header className="header">
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
                  <Link to="/account" className="user-link">
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

          <div id="search-form" ref={searchRef}>
            <input
              type="text"
              id="search"
              placeholder="Busque aqui"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length > 2 && setSearchResults.length > 0 && setShowDropdown(true)}
            />
            {showDropdown && searchTerm.length > 2 && (
              <div className="search-dropdown">
                {loadingSearch ? (
                  <div className="search-loading">Carregando...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="search-item"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img src={product.thumbnail} alt={product.title} />
                      <span>{product.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">Nenhum produto encontrado.</div>
                )}
              </div>
            )}
            <button type="submit" className="btn btn-half" onClick={(e) => e.preventDefault()}>Pesquisar</button>
          </div>

          <div className="header-actions-menu">
            <div className="wishlist-container">
              <span className="qty">{favoritesCount}</span>
              <i className="far fa-heart"></i>
              <Link to="/favorites">Favoritos</Link>
            </div>

            <div className="header-cart-container">
              <span className="qty">{cartCount}</span>
              <i className="fas fa-shopping-cart"></i>
              <Link to="/cart">Carrinho</Link>
            </div>
          </div>
        </div>
      </div>

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
