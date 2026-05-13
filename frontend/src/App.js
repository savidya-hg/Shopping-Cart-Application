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

  // 1. DEFINE the function here
  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log("Error fetching products:", err));
  };

  // Check Auth
  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/current_user', { withCredentials: true })
      .then(res => { if (res.data) setUser(res.data); })
      .catch(() => setUser(null));
  }, []);

  // 2. USE the function in useEffect
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

  const dynamicCategories = ['All', ...new Set(products.map(p => p.category))];

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
        fetchProducts={fetchProducts} // 3. NOW THIS IS DEFINED
      />
    </CartProvider>
  );
}

export default App;