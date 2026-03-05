import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CartToast } from './CartToast';

const CartContext = createContext();
const MAX_QUANTITY = 3;
const TOAST_ID = 'cart-notification';

// Helper para mostrar siempre el mismo toast (reemplaza si ya existe)
const showToast = (type, message) => {
  const content = <CartToast type={type} message={message} />;
  const options = {
    toastId: TOAST_ID,
    style: {
      background: 'transparent',
      boxShadow: 'none',
      padding: 0,
    },
    progressStyle: { display: 'none' },
    closeButton: false,
    icon: false,
  };

  if (toast.isActive(TOAST_ID)) {
    toast.update(TOAST_ID, { render: content, type, ...options });
  } else {
    toast[type](content, options);
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const localData = localStorage.getItem('cart_atlas');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart_atlas', JSON.stringify(cart));
  }, [cart]);

  const getPrecio = (product) =>
    product.en_oferta && product.precio_oferta
      ? product.precio_oferta
      : product.precio;

  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id_producto === product.id_producto);

    const availableStock =
      existingProduct?.stock != null
        ? existingProduct.stock
        : product.stock != null
        ? product.stock
        : Infinity;

    if (availableStock <= 0) {
      showToast('warning', `Sin stock disponible de ${product.nombre}`);
      return;
    }

    if (existingProduct) {
      if (existingProduct.cantidad >= availableStock) {
        showToast('warning', `Stock máximo alcanzado: ${availableStock} uds. de ${product.nombre}`);
        return;
      }

      if (existingProduct.cantidad >= MAX_QUANTITY) {
        showToast('warning', `Máximo ${MAX_QUANTITY} unidades por producto`);
        return;
      }

      showToast('info', `${product.nombre} — cantidad actualizada`);
      setCart(prevCart =>
        prevCart.map(item =>
          item.id_producto === product.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      showToast('success', `${product.nombre} añadido al carrito`);
      setCart(prevCart => [
        ...prevCart,
        { ...product, precio: getPrecio(product), cantidad: 1 },
      ]);
    }
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

  const totalPrecio = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalPrecio, totalItems, decreaseQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);