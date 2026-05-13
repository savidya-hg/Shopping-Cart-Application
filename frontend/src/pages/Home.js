import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ShoppingCart from './ShoppingCart';
import AdminDashboard from './AdminDashboard';
import Checkout from './Checkout';
import { CartContext } from '../context/CartContext';

const Home = ({ 
  user, 
  products, 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  isCartOpen, 
  setIsCartOpen, 
  view, 
  setView, 
  handleLogout, 
  dynamicCategories, 
  filteredProducts,
  fetchProducts
}) => {
  
  const { cartItems, clearCart } = useContext(CartContext); 
  const total = cartItems ? cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;

  return (
    <>
      <Navbar 
        user={user}
        categories={dynamicCategories}
        onLogout={handleLogout}
        onSearch={setSearchQuery} 
        onCategoryChange={setSelectedCategory} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      <main style={{ padding: '20px', marginTop: '20px' }}>
        {view === 'checkout' ? (
            <Checkout 
                cart={cartItems} 
                total={total} 
                user={user} 
                onBack={() => setView('shop')} 
                onClearCart={clearCart} 
            />
        ) : (
          user.role === 'admin' ? (
            /* pass categories and fetch products here */
            <AdminDashboard 
                categories={dynamicCategories} 
                refreshProducts={fetchProducts} 
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {filteredProducts.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )
        )}
      </main>

      <ShoppingCart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          onProceedToCheckout={() => {
              setIsCartOpen(false); 
              setView('checkout'); 
          }}
      />
    </>
  );
};

export default Home;