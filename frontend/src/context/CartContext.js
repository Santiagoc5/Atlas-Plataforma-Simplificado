import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // El carrito vive SIEMPRE en el localStorage del navegador
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('cart_atlas');
        return localData ? JSON.parse(localData) : [];
    });

    const isInitial = useRef(true);
    const lastNotification = useRef(null);

    // Guardar en LocalStorage cada vez que cambie el estado del carrito
    useEffect(() => {
        localStorage.setItem('cart_atlas', JSON.stringify(cart));

        // Mostrar notificaciones de productos añadidos/quitados
        if (!isInitial.current && lastNotification.current) {
            const { type, message } = lastNotification.current;
            if (type === 'success') toast.success(message);
            else if (type === 'info') toast.info(message);
            lastNotification.current = null;
        }

        isInitial.current = false;
    }, [cart]);

    // --- MÉTODOS ---
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id_producto === product.id_producto);
            if (existingProduct) {
                lastNotification.current = { type: 'info', message: `${product.nombre} +1` };
                return prevCart.map(item =>
                    item.id_producto === product.id_producto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            lastNotification.current = { type: 'success', message: `${product.nombre} añadido` };
            return [...prevCart, { ...product, cantidad: 1 }];
        });
    };

    const decreaseQuantity = (productId) => {
        setCart((prevCart) => {
            const item = prevCart.find(i => i.id_producto === productId);
            if (!item) return prevCart;
            if (item.cantidad === 1) return prevCart.filter(i => i.id_producto !== productId);
            return prevCart.map(i =>
                i.id_producto === productId ? { ...i, cantidad: i.cantidad - 1 } : i
            );
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id_producto !== productId));
    };

    const clearCart = () => setCart([]);

    // Cálculos
    const totalPrecio = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrecio, totalItems, decreaseQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);