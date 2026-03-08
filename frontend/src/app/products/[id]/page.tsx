'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { catalogApi } from '../../../lib/api';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    catalogApi.getProductById(Number(id)).then(setProduct).catch(() => router.push('/')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page container"><div className="skeleton" style={{ height: '400px', borderRadius: '16px' }} /></div>;
  if (!product) return null;

  const handleAdd = () => {
    addItem(product, cantidad);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stock = product.stock ?? 0;

  return (
    <div className="page container">
      <Link href="/" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>← Volver</Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Imagen */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>
          {product.imagen ? <img src={product.imagen} alt={product.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} /> : '🧴'}
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{product.subcategoria?.nombre}</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>{product.nombre}</h1>
          <p style={{ color: 'var(--text-light)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.descripcion || 'Sin descripción disponible.'}</p>

          {/* Atributos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {product.presentacion && <div className="card" style={{ padding: '0.75rem' }}><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Presentación</div><div style={{ fontWeight: 600 }}>{product.presentacion}</div></div>}
            {product.olor && <div className="card" style={{ padding: '0.75rem' }}><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aroma</div><div style={{ fontWeight: 600 }}>{product.olor}</div></div>}
            {product.color && <div className="card" style={{ padding: '0.75rem' }}><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Color</div><div style={{ fontWeight: 600 }}>{product.color}</div></div>}
            <div className="card" style={{ padding: '0.75rem' }}><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock</div><div style={{ fontWeight: 600, color: stock > 10 ? 'var(--accent)' : stock > 0 ? 'var(--warning)' : 'var(--danger)' }}>{stock > 0 ? `${stock} unidades` : 'Agotado'}</div></div>
          </div>

          {/* Precios */}
          {user ? (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Precio Minorista</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>Bs. {Number(product.precio_minorista).toFixed(2)}</div>
                </div>
                {product.precio_mayorista && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Precio Mayorista</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>Bs. {Number(product.precio_mayorista).toFixed(2)}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              🔒 <Link href="/login" style={{ color: 'var(--primary)' }}>Iniciá sesión</Link> para ver los precios y agregar al carrito.
            </div>
          )}

          {/* Cantidad + Agregar */}
          {user && stock > 0 && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="qty-controls">
                <button className="qty-btn" onClick={() => setCantidad(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-num">{cantidad}</span>
                <button className="qty-btn" onClick={() => setCantidad(q => Math.min(stock, q + 1))}>+</button>
              </div>
              <button className="btn btn-accent btn-lg" style={{ flex: 1 }} onClick={handleAdd}>
                {added ? '✓ Agregado' : '+ Agregar al carrito'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
