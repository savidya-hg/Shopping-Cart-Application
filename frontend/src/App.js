import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ShoppingCart from './pages/ShoppingCart';
import { CartProvider } from './context/CartContext';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Dummy products
  const products = [
    { _id: '1', name: 'Carrot', price: 2.5, category: 'Vegetables', image: 'https://via.placeholder.com/150', description: 'Fresh organic carrots' },
    { _id: '2', name: 'Chocolate Cake', price: 15.0, category: 'Cakes', image: 'https://via.placeholder.com/150', description: 'Rich dark chocolate' },
  ];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <CartProvider>
      <Navbar setCategory={setSelectedCategory} />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {filteredProducts.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
      <ShoppingCart />
    </CartProvider>
  );
}

export default App;