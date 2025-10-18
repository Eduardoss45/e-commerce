import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  return (
    <>
      <header className="header">
        <div className="header-top">
          <div className="header-top-container">
            <div className="store-info-container">
              <span>
                <i className="fas fa-phone"></i> (48)99999-0000
              </span>
              <span>
                <i className="far fa-envolope"></i> electron@email.com
              </span>
              <span>
                <i className="fas fa-map-marker-alt"></i> Rua Teste, 1234
              </span>
            </div>
            <div className="header-user-top-menu">
              <span>
                <i className="fas fa-dollar sign"></i> <a href="#">BRL</a>
              </span>
              <span>
                <i className="fas fa-user"></i> <Link to="/user-account">Minha Conta</Link>
                {location.pathname !== '/register' && (
                  <>
                    <i className="fas fa-user"></i> <Link to="/register">Registre-se</Link>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="main-header">
          <div className="main-header-container">
            <a href="#" id="brand">
              Electron <i className="fas fa-bolt"></i>
            </a>
            <form action="" id="search-form">
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
                <span className="qty">0</span>
                <i className="fas fa-shopping-cart"></i>
                <a href="#">Carrinho</a>
              </div>
            </div>
          </div>
        </div>
        <div className="header-bottom">
          <nav>
            <ul>
              <li>
                <a href="#">Home</a>
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
    </>
  );
};

export default Navbar;
