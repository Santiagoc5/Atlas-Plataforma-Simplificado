import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CartToast } from './CartToast';

// Se crea el contexto principal para manejar el estado del carrito
const CartContext = createContext();

// Constantes de configuración del carrito
const MAX_QUANTITY = 3; // Límite máximo de un mismo producto
const TOAST_ID = 'cart-notification'; // Identificador único para los mensajes emergentes

/**
 * Función auxiliar para mostrar notificaciones del carrito (Toast).
 * Reutiliza el mismo ToastId para sobreescribir el actual y evitar que se apilen notificaciones.
 * 
 * @param {string} type - El tipo de notificación (ej. 'success', 'info', 'warning')
 * @param {string} message - El mensaje a mostrar
 */
const showToast = (type, message) => {
  const content = <CartToast type={type} message={message} />;
  const options = {
    toastId: TOAST_ID,
    style: {
      background: 'transparent', // Se maneja el estilo dentro del propio componente CartToast
      boxShadow: 'none',
      padding: 0,
    },
    progressStyle: { display: 'none' }, // Ocula la barra de progreso inferior
    closeButton: false, // Sin botón de cerrar manual
    icon: false, // Oculta los iconos predeterminados de toastify
  };

  // Si ya existe un toast de carrito activo, se actualiza; de lo contrario, se crea uno nuevo.
  if (toast.isActive(TOAST_ID)) {
    toast.update(TOAST_ID, { render: content, type, ...options });
  } else {
    toast[type](content, options);
  }
};

/**
 * Proveedor principal del Contexto del Carrito (CartProvider).
 * Envuelve la aplicación para proveer el estado del carrito y sus funciones.
 */
export const CartProvider = ({ children }) => {
  // Inicialización del estado del carrito.
  // Hidrata desde localStorage en la primera carga para persistir compras previas.
  const [cart, setCart] = useState(() => {
    const localData = localStorage.getItem('cart_atlas');
    return localData ? JSON.parse(localData) : [];
  });

  // Efecto que sincroniza cualquier cambio del estado 'cart' en localStorage.
  useEffect(() => {
    localStorage.setItem('cart_atlas', JSON.stringify(cart));
  }, [cart]);

  /**
   * Determina el precio a cobrar por un producto.
   * Si está en oferta, se cobra el 'precio_oferta', sino el 'precio' regular.
   */
  const getPrecio = (product) =>
    product.en_oferta && product.precio_oferta
      ? product.precio_oferta
      : product.precio;

  /**
   * Añade un producto al carrito o incrementa su cantidad si ya existe.
   * Tiene en cuenta validaciones de stock máximo y límite por usuario.
   */
  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id_producto === product.id_producto);

    // Prioriza stock ya conocido en carrito; si no existe, usa stock del producto. Fallback directo a infinito temporalmente.
    const availableStock =
      existingProduct?.stock != null
        ? existingProduct.stock
        : product.stock != null
        ? product.stock
        : Infinity;

    // Validación 1: Producto agotado
    if (availableStock <= 0) {
      showToast('warning', `Sin stock disponible de ${product.nombre}`);
      return;
    }

    if (existingProduct) {
      // Validación 2: Intentar agregar más del stock disponible total
      if (existingProduct.cantidad >= availableStock) {
        showToast('warning', `Stock máximo alcanzado: ${availableStock} uds. de ${product.nombre}`);
        return;
      }

      // Validación 3: Límite por política de tienda (MAX_QUANTITY)
      if (existingProduct.cantidad >= MAX_QUANTITY) {
        showToast('warning', `Máximo ${MAX_QUANTITY} unidades por producto`);
        return;
      }

      // Si todo va bien, incrementa cantidad
      showToast('info', `${product.nombre} — cantidad actualizada`);
      setCart(prevCart =>
        prevCart.map(item =>
          item.id_producto === product.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      // Si el producto no estaba en el carrito, se añade por primera vez con cantidad 1
      showToast('success', `${product.nombre} añadido al carrito`);
      setCart(prevCart => [
        ...prevCart,
        { ...product, precio: getPrecio(product), cantidad: 1 },
      ]);
    }
  };

  /**
   * Decrementa en 1 la cantidad de un producto.
   * Si la cantidad llega a 1 e intenta decrementar, elimina el producto del carrito.
   */
  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find(i => i.id_producto === productId);
      if (!item) return prevCart;
      
      // Remover si está en la última unidad
      if (item.cantidad === 1) return prevCart.filter(i => i.id_producto !== productId);
      
      // Decrementar normalmente
      return prevCart.map(i =>
        i.id_producto === productId ? { ...i, cantidad: i.cantidad - 1 } : i
      );
    });
  };

  /**
   * Elimina completamente un producto del carrito sin importar la cantidad.
   */
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id_producto !== productId));
  };

  /**
   * Vacía todo el contenido del carrito.
   */
  const clearCart = () => setCart([]);

  // Variables derivadas del estado base del carrito.
  const totalPrecio = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        totalPrecio, 
        totalItems, 
        decreaseQuantity 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente al estado y funciones del carrito
export const useCart = () => useContext(CartContext);