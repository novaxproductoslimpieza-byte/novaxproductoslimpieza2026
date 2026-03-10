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
    <div className="container py-5">
      {/* Hero */}
      <div className="p-5 mb-5 rounded-4 shadow-sm border border-primary border-opacity-10" style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card2) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="row align-items-center position-relative">
          <div className="col-lg-8">
            <h1 className="display-4 fw-bold mb-3">
              Productos de <span className="text-primary">Limpieza</span>
            </h1>
            <p className="lead text-muted mb-4" style={{ maxWidth: '600px' }}>
              Catálogo profesional de productos de limpieza para hogar e industria. Calidad garantizada al mejor precio.
            </p>
            {!user && (
              <div className="alert alert-info d-inline-block border-0 rounded-pill px-4">
                <span className="me-2">💡</span>
                <Link href="/login" className="alert-link text-decoration-none fw-bold">Iniciá sesión</Link> para ver los precios y hacer pedidos.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-4 g-3 align-items-center">
        <div className="col-md-6 col-lg-4">
          <div className="position-relative">
            <span className="position-absolute translate-middle-y top-50 start-0 ps-3 text-muted">🔍</span>
            <input
              className="form-control ps-5 rounded-pill border-secondary border-opacity-10 bg-card2 text-light"
              placeholder="Buscar productos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 col-lg-8">
          <div className="d-flex flex-wrap gap-2 justify-content-md-end">
            <button 
              className={`btn rounded-pill px-4 ${!selectedCat ? 'btn-primary' : 'btn-outline-secondary'}`} 
              onClick={() => setSelectedCat(null)}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id} 
                className={`btn rounded-pill px-3 ${selectedCat === cat.id ? 'btn-primary' : 'btn-outline-secondary'}`} 
                onClick={() => setSelectedCat(cat.id)}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="col">
              <div className="card h-100 bg-dark border-secondary border-opacity-25 skeleton-card">
                <div className="skeleton rounded-top" style={{ height: '200px' }} />
                <div className="card-body p-3">
                  <div className="skeleton mb-2" style={{ height: '14px', borderRadius: '4px' }} />
                  <div className="skeleton mb-3" style={{ height: '12px', width: '60%', borderRadius: '4px' }} />
                  <div className="skeleton mt-auto" style={{ height: '24px', width: '40%', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-1 mb-3 opacity-50">📦</div>
          <h3 className="text-muted">No se encontraron productos</h3>
          <p className="text-secondary">Intenta con otros filtros de búsqueda.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {products.map(product => {
            const stock = stockLabel(product.stock ?? 0);
            return (
              <div key={product.id} className="col">
                <div className="card h-100 bg-dark border-secondary border-opacity-25 shadow-sm product-card-hover">
                  <Link href={`/products/${product.id}`} className="text-decoration-none">
                    <div className="card-img-top bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center border-bottom border-secondary border-opacity-10 overflow-hidden" style={{ height: '200px' }}>
                      {product.imagen ? (
                        <img src={product.imagen} alt={product.nombre} className="img-fluid h-100 w-100 object-fit-cover transition-scale" />
                      ) : (
                        <span className="display-4 opacity-50">🧴</span>
                      )}
                    </div>
                    <div className="card-body p-3 d-flex flex-column">
                      <h5 className="card-title text-light mb-1 fs-6 fw-bold text-truncate">{product.nombre}</h5>
                      <p className="card-text text-muted small mb-2">{product.subcategoria?.nombre}</p>
                      <div className="mt-auto">
                        {product.precio_minorista !== undefined ? (
                          <div className="h5 text-accent fw-bold mb-1">Bs. {Number(product.precio_minorista).toFixed(2)}</div>
                        ) : (
                          <div className="small text-muted fst-italic mb-1">🔒 Inicia sesión para ver precio</div>
                        )}
                        <span className={`badge rounded-pill bg-opacity-10 bg-${stock.cls === 'ok' ? 'success' : stock.cls === 'low' ? 'warning' : 'danger'} text-${stock.cls === 'ok' ? 'success' : stock.cls === 'low' ? 'warning' : 'danger'}`}>
                          {stock.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="card-footer bg-transparent border-0 p-3 pt-0">
                    <button
                      className="btn btn-primary w-100 btn-sm rounded-pill py-2 fw-bold"
                      disabled={product.stock === 0 || !user}
                      onClick={() => handleAddToCart(product)}
                    >
                      {!user ? '🔒 Inicia sesión' : product.stock === 0 ? 'Sin stock' : '+ Agregar al carrito'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
