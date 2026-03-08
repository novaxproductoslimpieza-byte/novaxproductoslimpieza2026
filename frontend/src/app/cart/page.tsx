'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ordersApi } from '../../lib/api';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrder = async () => {
    if (!user) { router.push('/login'); return; }
    setLoading(true);
    setError('');
    try {
      const productos = items.map(i => ({ producto_id: i.id, cantidad: i.cantidad, precio: i.precio_minorista }));
      await ordersApi.createOrder(productos);
      clearCart();
      router.push('/orders?success=1');
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido.');
    } finally {
      setLoading(false);
    }
  };

  if (itemCount === 0) return (
    <div className="page container">
      <div className="empty-state">
        <div className="empty-state-icon">🛒</div>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>Tu carrito está vacío</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Agrega productos desde el catálogo para empezar tu pedido.</p>
        <Link href="/" className="btn btn-primary">Ver catálogo</Link>
      </div>
    </div>
  );

  return (
    <div className="page container">
      <div className="page-header">
        <h1 className="page-title">Carrito de compras</h1>
        <p className="page-subtitle">{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</p>
      </div>
      <div className="cart-layout">
        {/* Items */}
        <div className="card" style={{ padding: 0 }}>
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-img">{item.imagen ? <img src={item.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : '🧴'}</div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.nombre}</div>
                <div className="cart-item-price">Bs. {item.precio_minorista.toFixed(2)} c/u</div>
              </div>
              <div className="qty-controls">
                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.cantidad - 1)}>−</button>
                <span className="qty-num">{item.cantidad}</span>
                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.cantidad + 1)}>+</button>
              </div>
              <div style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>Bs. {(item.precio_minorista * item.cantidad).toFixed(2)}</div>
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>✕</button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="order-summary">
          <div className="summary-title">Resumen del pedido</div>
          {items.map(item => (
            <div key={item.id} className="summary-row">
              <span>{item.nombre} ×{item.cantidad}</span>
              <span>Bs. {(item.precio_minorista * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span className="summary-total-amount">Bs. {total.toFixed(2)}</span>
          </div>
          {error && <div className="alert alert-error mt-2">{error}</div>}
          {user ? (
            <button className="btn btn-accent btn-lg w-full mt-2" onClick={handleOrder} disabled={loading}>
              {loading ? 'Confirmando...' : 'Confirmar pedido'}
            </button>
          ) : (
            <Link href="/login" className="btn btn-primary btn-lg w-full mt-2">Inicia sesión para pedir</Link>
          )}
          <button className="btn btn-secondary w-full mt-1 btn-sm" onClick={clearCart}>Vaciar carrito</button>
        </div>
      </div>
    </div>
  );
}
