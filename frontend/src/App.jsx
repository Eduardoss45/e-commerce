import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './ui/Navbar';
import Footer from './ui/Footer';
import Newsletter from './ui/Newsletter';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
      {location.pathname === '/' ? (
        <>
          <Newsletter />
        </>
      ) : (
        <></>
      )}
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}

export default App;
