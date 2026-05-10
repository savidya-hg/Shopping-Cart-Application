import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Navbar = ({ setCategory }) => {
    const { cartItems } = useContext(CartContext);
    const categories = ['All', 'Vegetables', 'Fruits', 'Cakes', 'Biscuits'];

    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>GreenGrocery</div>
            <div style={styles.categories}>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)} style={styles.catBtn}>
                        {cat}
                    </button>
                ))}
            </div>
            <div style={styles.cartIcon}>
                🛒 <span style={styles.badge}>{cartItems.length}</span>
            </div>
        </nav>
    );
};

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#2ecc71', color: '#fff', alignItems: 'center', flexWrap: 'wrap' },
    logo: { fontSize: '1.5rem', fontWeight: 'bold' },
    catBtn: { background: 'none', border: 'none', color: 'white', margin: '0 10px', cursor: 'pointer', fontSize: '1rem' },
    cartIcon: { cursor: 'pointer', position: 'relative', fontSize: '1.2rem' },
    badge: { background: 'red', borderRadius: '50%', padding: '2px 6px', fontSize: '0.8rem' }
};

export default Navbar;