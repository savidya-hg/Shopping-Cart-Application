import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ShoppingCart = () => {
    const { cartItems, totalPrice, updateQuantity, removeFromCart } = useContext(CartContext);

    return (
        <div style={styles.container}>
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? <p>Your cart is empty.</p> : (
                <>
                    <div style={styles.list}>
                        {cartItems.map(item => (
                            <div key={item._id} style={styles.item}>
                                <img src={item.image} alt={item.name} style={styles.thumb} />
                                <div style={styles.details}>
                                    <h4>{item.name}</h4>
                                    <p>${item.price} x {item.quantity}</p>
                                </div>
                                <div style={styles.controls}>
                                    <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                                    <span style={{margin: '0 10px'}}>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                                    <button onClick={() => removeFromCart(item._id)} style={styles.delBtn}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={styles.summary}>
                        <h3>Total: ${totalPrice.toFixed(2)}</h3>
                        <button style={styles.checkoutBtn}>Proceed to Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px', maxWidth: '800px', margin: 'auto'
    },
    item: {
        display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0'
    },
    thumb: {
        width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px'
    },
    details: {
        flex: 1
    },
    delBtn: {
        marginLeft: '20px', color: 'red', border: 'none', background: 'none', cursor: 'pointer'
    },
    summary: {
        marginTop: '20px', textAlign: 'right', borderTop: '2px solid #2ecc71', paddingTop: '10px'
    },
    checkoutBtn: {
        background: '#27ae60', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem'
    }
};

export default ShoppingCart;