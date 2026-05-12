import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ShoppingCart from './pages/ShoppingCart';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { CartProvider } from './context/CartContext';

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/current_user', { withCredentials: true })
      .then(res => { if (res.data) setUser(res.data); })
      .catch(() => setUser(null));
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = () => {
    window.open("http://localhost:5000/api/auth/logout", "_self");
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;  
  });

  // Calculate categories based on current products in database
  const dynamicCategories = ['All', ...new Set(products.map(p => p.category))];

  if (!user) return <Login />;

  return (
    <CartProvider>
      <Navbar 
        user={user}
        categories={dynamicCategories}
        onLogout={handleLogout}
        onSearch={setSearchQuery} 
        onCategoryChange={setSelectedCategory} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      <main style={styles.mainContent}>
        {user.role === 'admin' ? (
          <AdminDashboard 
             categories={dynamicCategories} 
             refreshProducts={fetchProducts}
          />
        ) : (
          <div style={styles.productGrid}>
            {filteredProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </main>

      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </CartProvider>
  );
}

const styles = {
  mainContent: { padding: '20px', marginTop: '20px' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }
};

export default App;