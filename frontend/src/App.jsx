import { Outlet } from 'react-router-dom';
import Navbar from './ui/Navbar';
import Footer from './ui/Footer';
import Newsletter from './ui/Newsletter';

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Newsletter />
      <Footer />
    </>
  );
}

export default App;
