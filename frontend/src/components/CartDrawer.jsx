import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, addToCart, totalPrecio, clearCart, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  const handleGoToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.classList.add('drawer-open');
      document.body.classList.add('cart-open'); // ← mueve los toasts
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
    } else {
      const scrollY = parseInt(document.body.style.top || '0') * -1;
      document.body.classList.remove('drawer-open');
      document.body.classList.remove('cart-open'); // ← restaura posición
      document.documentElement.style.overflow = 'unset';
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.top = 'unset';
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.classList.remove('drawer-open');
      document.body.classList.remove('cart-open');
      document.documentElement.style.overflow = 'unset';
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.top = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, left: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end'
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '400px', backgroundColor: 'white', height: '100%',
        display: 'flex', flexDirection: 'column', padding: '20px'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Tu Carrito</h2>
          {cart.length > 0 && (
            <button onClick={clearCart} style={{ border: 'none', background: 'none', color: '#888', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
              Vaciar
            </button>
          )}
          <X onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>El carrito está vacío</p>
          ) : (
            cart.map(item => (
              <div key={item.id_producto} style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <img src={item.imagen} alt={item.nombre} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{item.nombre}</h4>
                  <p style={{ fontSize: '13px', color: '#e60000', fontWeight: 'bold' }}>${Number(item.precio).toLocaleString('es-CO')}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                    <button onClick={() => decreaseQuantity(item.id_producto)} style={{ border: '1px solid #ddd', background: 'none', borderRadius: '4px' }}><Minus size={14} /></button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => addToCart(item)} style={{ border: '1px solid #ddd', background: 'none', borderRadius: '4px' }}><Plus size={14} /></button>
                    <Trash2 size={16} color="#888" onClick={() => removeFromCart(item.id_producto)} style={{ marginLeft: '10px', cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>${totalPrecio.toLocaleString('es-CO')}</span>
            </div>
            <button onClick={handleGoToCheckout} style={{
              width: '100%', backgroundColor: '#e60000', color: 'white', border: 'none',
              padding: '15px', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer'
            }}>
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;