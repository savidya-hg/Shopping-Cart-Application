import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div style={styles.card}>
            <img src={product.image} alt={product.name} style={styles.image} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p style={styles.price}>${product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)} style={styles.addBtn}>
                Add to Cart
            </button>
        </div>
    );
};

const styles = {
    card: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', width: '250px', textAlign: 'center', margin: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    image: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' },
    price: { fontWeight: 'bold', color: '#27ae60', fontSize: '1.2rem' },
    addBtn: { background: '#2ecc71', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', width: '100%' }
};

export default ProductCard;