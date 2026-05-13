import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ShoppingCart = ({ isOpen, onClose, onProceedToCheckout }) => {
    const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.sidebar}>
                <div style={styles.header}>
                    <h3>Your Cart ({cartItems.length})</h3>
                    <button onClick={onClose} style={styles.closeBtn}><i className="fas fa-times"></i></button>
                </div>

                <div style={styles.itemList}>
                    {cartItems.map(item => (
                        <div key={item._id} style={styles.itemCard}>
                            <img src={item.image} alt={item.name} style={styles.itemImg} />
                            <div style={styles.itemDetails}>
                                <h4 style={styles.itemName}>{item.name}</h4>
                                <p style={styles.itemPrice}>{item.price} LKR</p>
                                
                                <div style={styles.controls}>
                                    <div style={styles.qtyBox}>
                                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                    </div>
                                    
                                    {/* Display Total Price for this item specific to quantity */}
                                    <div style={styles.lineTotal}>
                                        Total: <strong>{(item.price * item.quantity).toFixed(2)} LKR</strong>
                                    </div>
                                    
                                    <button onClick={() => removeFromCart(item._id)} style={styles.removeBtn}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.footer}>
                    <div style={styles.totalRow}>
                        <span>Grand Total:</span>
                        <span>{total.toFixed(2)} LKR</span>
                    </div>
                    <button 
                        style={styles.checkoutBtn} 
                        onClick={onProceedToCheckout}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000 },
    sidebar: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '400px', background: 'white', display: 'flex', flexDirection: 'column' },
    header: { padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    closeBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' },
    itemList: { flex: 1, overflowY: 'auto', padding: '20px' },
    itemCard: { display: 'flex', gap: '15px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #f9f9f9' },
    itemImg: { width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' },
    itemDetails: { flex: 1 },
    itemName: { margin: '0 0 5px 0', fontSize: '1rem' },
    itemPrice: { margin: 0, color: '#7f8c8d', fontSize: '0.9rem' },
    controls: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' },
    qtyBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f1f1', borderRadius: '5px', padding: '2px 8px' },
    lineTotal: { fontSize: '0.85rem', color: '#27ae60' },
    removeBtn: { color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer' },
    footer: { padding: '20px', borderTop: '2px solid #eee' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '15px' },
    checkoutBtn: { width: '100%', padding: '15px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default ShoppingCart;