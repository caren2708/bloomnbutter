import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import Home from './routes/Home';
import Shop from './routes/Shop';
import ProductDetail from './routes/ProductDetail';
import Wishlist from './routes/Wishlist';
import About from './routes/About';
import Contact from './routes/Contact';
import { useEffect } from 'react';
import { useProductStore } from './store/productStore';
function App() {
  const location = useLocation();
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const fetchCategories = useProductStore(state => state.fetchCategories);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
