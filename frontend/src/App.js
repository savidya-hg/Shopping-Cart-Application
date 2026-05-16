import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Home from './pages/Home'; 
import { CartProvider } from './context/CartContext';

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState('shop');

  const fetchProducts = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`, { withCredentials: true })
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error("Error fetching products:", err);
        setProducts([]);
      });
  };

  // Check Auth
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/auth/current_user`, { withCredentials: true })
      .then(res => { if (res.data) setUser(res.data); })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = () => {
    window.open(`${process.env.REACT_APP_API_URL}/api/auth/logout`, "_self");
  };

  const filteredProducts = Array.isArray(products) ? products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;  
  }) : [];

  const dynamicCategories = Array.isArray(products) ? ['All', ...new Set(products.map(p => p.category))] : ['All'];

  if (!user) return <Login />;

  return (
    <CartProvider>
      <Home 
        user={user}
        products={products}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        view={view}
        setView={setView}
        handleLogout={handleLogout}
        dynamicCategories={dynamicCategories}
        filteredProducts={filteredProducts}
        fetchProducts={fetchProducts}
      />
    </CartProvider>
  );
}

export default App;