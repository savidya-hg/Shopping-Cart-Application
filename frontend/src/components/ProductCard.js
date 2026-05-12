import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div style={styles.card}>
            <img src={product.image} alt={product.name} style={styles.image} />
            <div style={styles.info}>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.category}>{product.category}</p>
                <p style={styles.price}>{product.price.toFixed(2)} LKR</p>
                <button style={styles.btn} onClick={() => addToCart(product)}>
                    <i className="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    );
};

const styles = {
    card: { background: 'white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', overflow: 'hidden', textAlign: 'center', paddingBottom: '15px' },
    image: { width: '100%', height: '180px', objectFit: 'cover' },
    info: { padding: '15px' },
    name: { margin: '10px 0 5px', fontSize: '1.1rem' },
    category: { color: '#7f8c8d', fontSize: '0.85rem', marginBottom: '10px' },
    price: { fontWeight: 'bold', color: '#27ae60', fontSize: '1.1rem', marginBottom: '15px' },
    btn: { background: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }
};

export default ProductCard;