'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { catalogApi } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = {};
    if (selectedCat) params.category_id = selectedCat;
    if (search) params.search = search;
    catalogApi.getProducts(params)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCat, search]);

  const handleAddToCart = (product: any) => {
    addItem(product);
  };

  const stockLabel = (stock: number) => {
    if (stock === 0) return { label: 'Sin stock', cls: 'out' };
    if (stock < 10) return { label: `Últimas ${stock} unidades`, cls: 'low' };
    return { label: `${stock} disponibles`, cls: 'ok' };
  };

  return (
    <div className="page container">
      {/* Hero */}
      <div style={{ marginBottom: '2.5rem', padding: '2.5rem', background: 'linear-gradient(135deg, #12161e 0%, #1a1f2e 100%)', borderRadius: '16px', border: '1px solid rgba(59,130,246,0.2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Productos de <span style={{ color: 'var(--primary)' }}>Limpieza</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px' }}>
          Catalogo profesional de productos de limpieza para hogar e industria. Calidad garantizada.
        </p>
        {!user && (
          <p style={{ marginTop: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            💡 <Link href="/login" style={{ color: 'var(--primary)' }}>Iniciá sesión</Link> para ver los precios y hacer pedidos.
          </p>
        )}
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="form-input search-input"
            placeholder="Buscar productos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          <button className={`chip ${!selectedCat ? 'active' : ''}`} onClick={() => setSelectedCat(null)}>Todos</button>
          {categories.map(cat => (
            <button key={cat.id} className={`chip ${selectedCat === cat.id ? 'active' : ''}`} onClick={() => setSelectedCat(cat.id)}>
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="products-grid">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="product-card">
              <div className="skeleton" style={{ aspectRatio: '1' }} />
              <div className="product-card-body" style={{ gap: '0.6rem' }}>
                <div className="skeleton" style={{ height: '14px', borderRadius: '999px' }} />
                <div className="skeleton" style={{ height: '12px', width: '60%', borderRadius: '999px' }} />
                <div className="skeleton" style={{ height: '20px', width: '40%', borderRadius: '999px', marginTop: '0.5rem' }} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p>No se encontraron productos.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => {
            const stock = stockLabel(product.stock ?? 0);
            return (
              <div key={product.id} className="product-card">
                <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div className="product-card-img">
                    {product.imagen ? <img src={product.imagen} alt={product.nombre} /> : '🧴'}
                  </div>
                  <div className="product-card-body">
                    <div className="product-name">{product.nombre}</div>
                    <div className="product-sub">{product.subcategoria?.nombre}</div>
                    {product.precio_minorista !== undefined ? (
                      <div className="product-price">Bs. {Number(product.precio_minorista).toFixed(2)}</div>
                    ) : (
                      <div className="product-price-locked">🔒 Inicia sesión para ver precio</div>
                    )}
                    <div className={`product-stock ${stock.cls}`}>{stock.label}</div>
                  </div>
                </Link>
                <div className="product-card-footer">
                  <button
                    className="btn btn-primary w-full btn-sm"
                    disabled={product.stock === 0 || !user}
                    onClick={() => handleAddToCart(product)}
                  >
                    {!user ? '🔒 Inicia sesión' : product.stock === 0 ? 'Sin stock' : '+ Agregar al carrito'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
