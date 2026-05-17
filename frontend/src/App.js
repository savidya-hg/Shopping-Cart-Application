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

  const API_URL = process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL 
    : `${process.env.REACT_APP_API_URL}/api`;

  const fetchProducts = () => {
    axios.get(`${API_URL}/products`, { withCredentials: true })
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error("Error fetching products:", err);
        setProducts([]);
      });
  };

  // Check Auth - runs once on mount
  useEffect(() => {
    axios.get(`${API_URL}/auth/current_user`, { withCredentials: true })
      .then(res => { 
        if (res.data && res.data._id) {
          setUser(res.data);
          fetchProducts();
        } else {
          setUser(null);
        }
      })
      .catch(err => {
        console.error("Auth check failed:", err.status);
        setUser(null);
      });
  }, [API_URL]);

  const handleLogout = () => {
    window.open(`${API_URL}/auth/logout`, "_self");
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