import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // calculate total price
    useEffect(() => {
        const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotalPrice(total);
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item => 
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, newQty) => {
        if (newQty < 1) return; // Prevent 0 or negative quantities

        setCartItems(prevItems => 
            prevItems.map(item => 
                item._id === productId 
                    ? { ...item, quantity: parseInt(newQty) } // Force integer
                    : item
            )
        );
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
    };

    return (
        <CartContext.Provider value={{ cartItems, totalPrice, addToCart, updateQuantity, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};