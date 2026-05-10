import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ShoppingCart = ({ isOpen, onClose }) => {
    const { cartItems, totalPrice, updateQuantity, removeFromCart } = useContext(CartContext);

    return (
        <>
            {isOpen && <div style={styles.overlay} onClick={onClose} />}
            
            {/* The actual Sidebar */}
            <div style={{ ...styles.sidebar, right: isOpen ? '0' : '-400px' }}>
                <div style={styles.header}>
                    <h2>Your Cart</h2>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                <div style={styles.content}>
                    {cartItems.length === 0 ? (
                        <p style={{ textAlign: 'center', marginTop: '50px' }}>Your cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item._id} style={styles.item}>
                                <img src={item.image} alt={item.name} style={styles.thumb} />
                                <div style={styles.details}>
                                    <strong>{item.name}</strong>
                                    <p>${item.price.toFixed(2)}</p>
                                    <div style={styles.qtyControls}>
                                        <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item._id)} style={styles.delBtn}>🗑️</button>
                            </div>
                        ))
                    )}
                </div>

                <div style={styles.footer}>
                    <h3>Total: ${totalPrice.toFixed(2)}</h3>
                    <button style={styles.checkoutBtn}>Checkout Now</button>
                </div>
            </div>
        </>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 999 },
    sidebar: { position: 'fixed', top: 0, height: '100%', width: '350px', background: 'white', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', transition: 'right 0.3s ease', zIndex: 1000, display: 'flex', flexDirection: 'column' },
    header: { padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' },
    closeBtn: { border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' },
    content: { flex: 1, overflowY: 'auto', padding: '20px' },
    item: { display: 'flex', marginBottom: '15px', borderBottom: '1px solid #f9f9f9', paddingBottom: '10px' },
    thumb: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' },
    details: { flex: 1, paddingLeft: '10px' },
    qtyControls: { display: 'flex', gap: '10px', alignItems: 'center', marginTop: '5px' },
    delBtn: { background: 'none', border: 'none', cursor: 'pointer' },
    footer: { padding: '20px', borderTop: '1px solid #eee', background: '#fff' },
    checkoutBtn: { width: '100%', background: '#27ae60', color: 'white', border: 'none', padding: '15px', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer' }
};

export default ShoppingCart;