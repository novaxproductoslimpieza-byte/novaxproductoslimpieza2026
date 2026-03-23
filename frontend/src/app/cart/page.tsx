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
      console.error("Error in createOrder:", err);
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
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h2 fw-bold text-dark mb-1 window-title">Carrito de compras</h1>
          <p className="text-muted small mb-0">{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Items */}
        <div className="col-lg-8">
          <div className="window-card p-0 overflow-hidden">
            <div className="list-group list-group-flush bg-transparent">
              {items.map(item => (
                <div key={item.id} className="list-group-item bg-transparent border-bottom border-light p-3 p-md-4 last-border-0">
                  <div className="row align-items-center g-3">
                    <div className="col-auto">
                      <div className="bg-light rounded-3 d-flex align-items-center justify-content-center overflow-hidden border" style={{ width: '80px', height: '80px' }}>
                        {item.imagen ? <img src={item.imagen} alt={item.nombre} className="img-fluid h-100 w-100 object-fit-cover" /> : <span className="fs-3">🧴</span>}
                      </div>
                    </div>
                    <div className="col flex-grow-1">
                      <h6 className="text-dark fw-bold mb-1">{item.nombre}</h6>
                      <p className="text-primary-dark small fw-bold mb-0">Bs. {item.precio_minorista.toFixed(2)} c/u</p>
                    </div>
                    <div className="col-12 col-sm-auto">
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <div className="input-group input-group-sm rounded-pill overflow-hidden border border-light" style={{ width: '110px' }}>
                          <button className="btn btn-light text-dark" type="button" onClick={() => updateQuantity(item.id, item.cantidad - 1)}>−</button>
                          <span className="form-control bg-white border-0 text-center text-dark px-0 fw-bold">{item.cantidad}</span>
                          <button className="btn btn-light text-dark" type="button" onClick={() => updateQuantity(item.id, item.cantidad + 1)}>+</button>
                        </div>
                        <div className="text-dark fw-bold ms-sm-3" style={{ minWidth: '90px', textAlign: 'right' }}>
                          Bs. {(item.precio_minorista * item.cantidad).toFixed(2)}
                        </div>
                        <button className="btn btn-link text-danger text-decoration-none p-2 ms-2 hover-scale" onClick={() => removeItem(item.id)} title="Eliminar">
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 d-none d-lg-block">
            <Link href="/" className="btn btn-link text-primary-dark text-decoration-none p-0 fw-bold">
              ← Seguir comprando catálogo
            </Link>
          </div>
        </div>

        {/* Resumen */}
        <div className="col-lg-4">
          <div className="window-card sticky-top" style={{ top: '90px' }}>
            <div className="card-body p-0">
              <h5 className="card-title text-dark fw-bold mb-4">Resumen del pedido</h5>
              <div className="mb-4">
                {items.map(item => (
                  <div key={item.id} className="d-flex justify-content-between mb-2 small text-muted">
                    <span className="text-truncate me-3 text-dark">{item.nombre} <span className="opacity-50">×{item.cantidad}</span></span>
                    <span className="flex-shrink-0 fw-semibold">Bs. {(item.precio_minorista * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className="border-light my-4" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="text-dark fw-bold h5 mb-0">Total</span>
                <span className="text-primary-dark fw-bold h4 mb-0">Bs. {total.toFixed(2)}</span>
              </div>

              {error && <div className="alert alert-danger border-0 small py-2 mb-3">{error}</div>}

              {user ? (
                <button className="btn btn-primary-dark w-100 py-3 fw-bold text-dark rounded-pill shadow-sm" onClick={handleOrder} disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : '🚀 '}
                  {loading ? 'Confirmando...' : 'Confirmar pedido'}
                </button>
              ) : (
                <Link href="/login" className="btn btn-primary-dark w-100 py-3 fw-bold text-dark rounded-pill shadow-sm">
                  Inicia sesión para pedir
                </Link>
              )}

              <div className="mt-3">
                <button className="btn btn-outline-danger w-100 btn-sm rounded-pill border-light" onClick={clearCart}>
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 d-lg-none text-center">
            <Link href="/" className="btn btn-link text-primary-dark text-decoration-none fw-bold">
              ← Seguir comprando catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
