import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ShoppingCart from './pages/ShoppingCart';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './context/CartContext';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('shop');
  const [isCartOpen, setIsCartOpen] = useState(false);  //sideview
  //fetch db data
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <CartProvider>
      <Navbar setCategory={setSelectedCategory} onOpenCart={() => setIsCartOpen(true)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {filteredProducts.map(p => <ProductCard key={p._id} product={p} />)}
        <button onClick={() => setView('shop')} style={view === 'shop' ? styles.activeTab : styles.tab}>Shop</button>
        <button onClick={() => setView('admin')} style={view === 'admin' ? styles.activeTab : styles.tab}>Admin Panel</button>
      </div>
      <main style={styles.mainContent}>
        {view === 'admin' ? (
          <AdminDashboard />
        ) : (
          <div style={styles.productGrid}>
            {filteredProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </main>

      {/* The Sidebar Cart Component */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </CartProvider>
  );
}

const styles = {
  mainContent: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px', padding: '20px' },
  viewToggle: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' },
  tab: { padding: '10px 20px', cursor: 'pointer', border: '1px solid #ddd', background: '#f9f9f9' },
  activeTab: { padding: '10px 20px', cursor: 'pointer', border: '1px solid #2ecc71', background: '#2ecc71', color: 'white' }
};

export default App;