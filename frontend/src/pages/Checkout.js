import React from 'react';
import axios from 'axios';

const Checkout = ({ cart, total, user, onBack, onClearCart }) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const API_URL = process.env.NODE_ENV === 'production' 
        ? API_BASE_URL 
        : `${API_BASE_URL}/api`;
    
    const handleCheckout = async () => {
        const orderData = {
            user: user.email,
            items: cart.map(item => ({
                productId: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: total
        };

        try {
            // calls orderRoute.js endpoint to save the data
            await axios.post(`${API_URL}/orders`, orderData, { withCredentials: true });
            alert("Order placed successfully!");
            onClearCart();
            onBack(); 
        } catch (err) {
            console.error("Checkout failed:", err);
            alert("Failed to place order.");
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.billCard}>
                <div style={styles.headerArea}>
                    <h2 style={styles.brandTitle}><i className="fas fa-leaf"></i> Green Grocery</h2>
                    <p style={styles.subHeader}>Official Receipt</p>
                </div>

                <div style={styles.billHeader}>
                    <span style={styles.colProduct}>Product</span>
                    <span style={styles.colQty}>Qty</span>
                    <span style={styles.colPrice}>Price/Unit</span>
                    <span style={styles.colTotal}>Total</span>
                </div>
                
                <div style={styles.itemList}>
                    {cart.map((item) => (
                        <div key={item._id} style={styles.billRow}>
                            <span style={styles.colProduct}>{item.name}</span>
                            <span style={styles.colQty}>{item.quantity}</span>
                            <span style={styles.colPrice}>{item.price.toFixed(2)}</span>
                            <span style={styles.colTotal}>{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div style={styles.divider}></div>
                
                <div style={styles.totalSection}>
                    <span>Grand Total (LKR):</span>
                    <span style={styles.grandTotalText}>{total.toFixed(2)}</span>
                </div>

                <div style={styles.buttonGroup}>
                    <button onClick={onBack} style={styles.backBtn}>Back</button>
                    <button onClick={handleCheckout} style={styles.payBtn}>Proceed to Payment</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    billCard: { background: 'white', padding: '40px', borderRadius: '4px', width: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontFamily: 'Courier New, Courier, monospace' },
    headerArea: { textAlign: 'center', marginBottom: '20px', borderBottom: '2px dashed #000', paddingBottom: '10px' },
    brandTitle: { margin: 0, color: '#27ae60', fontSize: '1.5rem', textTransform: 'uppercase' },
    subHeader: { margin: '5px 0 0 0', fontSize: '0.8rem', color: '#666' },
    
    billHeader: { display: 'flex', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px', fontSize: '0.9rem' },
    billRow: { display: 'flex', marginBottom: '8px', fontSize: '0.9rem' },
    
    colProduct: { flex: 2 },
    colQty: { flex: 0.5, textAlign: 'center' },
    colPrice: { flex: 1, textAlign: 'right' },
    colTotal: { flex: 1, textAlign: 'right' },
    
    itemList: { marginBottom: '20px' },
    divider: { borderBottom: '2px dashed #000', margin: '20px 0' },
    
    totalSection: { display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' },
    grandTotalText: { borderBottom: ' double 3px #000' },

    buttonGroup: { display: 'flex', justifyContent: 'space-between', marginTop: '40px' },
    backBtn: { padding: '10px 25px', borderRadius: '4px', border: '1px solid #000', cursor: 'pointer', background: 'white', fontFamily: 'sans-serif' },
    payBtn: { padding: '10px 25px', borderRadius: '4px', border: 'none', background: '#27ae60', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'sans-serif' }
};

export default Checkout;