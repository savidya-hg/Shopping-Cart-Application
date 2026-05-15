import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Navbar = ({ user, categories, onLogout, onSearch, onCategoryChange, onOpenCart }) => {
    const { cartItems } = useContext(CartContext);
    const [isHovered, setIsHovered] = useState(false);
    const isAdmin = user?.role === 'admin';

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>
                <i className="fas fa-leaf" style={{ marginRight: '8px' }}></i>
                Green Grocery
            </div>
            
            {!isAdmin && (
                <div style={styles.middle}>
                    <div style={styles.searchBox}>
                        <i className="fas fa-search" style={styles.searchIcon}></i>
                        <input 
                            placeholder="Search fresh groceries..." 
                            style={styles.navSearch} 
                            onChange={e => onSearch(e.target.value)} 
                        />
                    </div>
                    <select style={styles.navSelect} onChange={e => onCategoryChange(e.target.value)}>
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            )}

            <div style={styles.right}>
                {!isAdmin && (
                    <div onClick={onOpenCart} style={styles.cartIconContainer}>
                        <i className="fas fa-shopping-cart" style={styles.cartIcon}></i>
                        {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
                    </div>
                )}
                
                <div style={styles.profileArea}>
                    <span style={styles.userName}>{user?.name}</span>
                    <button 
                        onClick={onLogout} 
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                            ...styles.logoutBtn,
                            backgroundColor: isHovered ? '#1e8449' : 'white',
                            color: isHovered ? 'white' : '#27ae60'
                        }}
                    >
                        <i className="fas fa-sign-out-alt" style={{ marginRight: '5px' }}></i>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 5%', background: '#27ae60', color: 'white', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    logo: { fontSize: '1.4rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' },
    middle: { flex: 2, display: 'flex', justifyContent: 'center', gap: '20px', margin: '0 20px' },
    searchBox: { position: 'relative', width: '100%' , maxWidth: '450px' },
    searchIcon: { position: 'absolute', left: '12px', top: '12px', color: '#999' },
    navSearch: { width: '90%', padding: '10px 10px 10px 40px', borderRadius: '25px', border: 'none', outline: 'none' },
    navSelect: { padding: '10px 15px', borderRadius: '20px', border: 'none', cursor: 'pointer', outline: 'none' , minWidth: '100px' , backgroundColor: 'white' },
    right: { display: 'flex', alignItems: 'center', gap: '25px' },
    cartIconContainer: { position: 'relative', cursor: 'pointer' },
    cartIcon: { fontSize: '1.5rem' },
    badge: { position: 'absolute', top: '-8px', right: '-12px', background: '#e74c3c', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: '0.75rem', fontWeight: 'bold', border: '2px solid #27ae60' },
    profileArea: { display: 'flex', alignItems: 'center', gap: '15px' },
    userName: { fontWeight: '500', fontSize: '0.95rem' },
    logoutBtn: { 
        display: 'flex', alignItems: 'center', padding: '8px 15px', borderRadius: '20px', 
        border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: 'bold', fontSize: '0.85rem' 
    }
};

export default Navbar;