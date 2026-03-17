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
    <div className="container py-5">
      <Link href="/" className="btn btn-outline-secondary btn-sm rounded-pill px-4 mb-4 border-secondary border-opacity-25 text-dark transition-scale">
        <span className="me-2">←</span> Volver
      </Link>

      <div className="row g-5">
        {/* Imagen */}
        <div className="col-lg-6">
          <div className="card bg-dark border-secondary border-opacity-25 shadow-lg overflow-hidden ratio ratio-1x1" style={{ borderRadius: '2rem' }}>
            <div className="d-flex align-items-center justify-content-center bg-secondary bg-opacity-5">
              {product.imagen ? (
                <img src={product.imagen} alt={product.nombre} className="img-fluid w-100 h-100 object-fit-cover shadow-sm" />
              ) : (
                <div className="display-1 opacity-25">🧴</div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="col-lg-6">
          <div className="ps-lg-4">
            <nav aria-label="breadcrumb" className="mb-2">
              <ol className="breadcrumb small mb-0">
                <li className="breadcrumb-item"><Link href="/" className="text-secondary text-decoration-none">Catálogo</Link></li>
                <li className="breadcrumb-item active text-primary" aria-current="page">{product.subcategoria?.nombre}</li>
              </ol>
            </nav>

            <h1 className="display-5 fw-bold text-dark mb-3">{product.nombre}</h1>
            <p className="lead text-muted mb-4" style={{ lineHeight: '1.8' }}>{product.descripcion || 'Sin descripción disponible.'}</p>

            {/* Atributos */}
            <div className="row g-2 mb-4">
              {product.presentacion && (
                <div className="col-6 col-md-4">
                  <div className="card bg-secondary bg-opacity-10 border-secondary border-opacity-10 p-2 text-center" style={{ borderRadius: '1rem' }}>
                    <div className="extra-small text-muted text-uppercase fw-bold mb-1">Presentación</div>
                    <div className="small fw-semibold text-dark">{product.presentacion}</div>
                  </div>
                </div>
              )}
              {product.olor && (
                <div className="col-6 col-md-4">
                  <div className="card bg-secondary bg-opacity-10 border-secondary border-opacity-10 p-2 text-center" style={{ borderRadius: '1rem' }}>
                    <div className="extra-small text-muted text-uppercase fw-bold mb-1">Aroma</div>
                    <div className="small fw-semibold text-dark">{product.olor}</div>
                  </div>
                </div>
              )}
              {product.color && (
                <div className="col-6 col-md-4">
                  <div className="card bg-secondary bg-opacity-10 border-secondary border-opacity-10 p-2 text-center" style={{ borderRadius: '1rem' }}>
                    <div className="extra-small text-muted text-uppercase fw-bold mb-1">Color</div>
                    <div className="small fw-semibold text-dark">{product.color}</div>
                  </div>
                </div>
              )}
              <div className="col-6 col-md-4">
                <div className="card bg-secondary bg-opacity-10 border-secondary border-opacity-10 p-2 text-center" style={{ borderRadius: '1rem' }}>
                  <div className="extra-small text-muted text-uppercase fw-bold mb-1">Stock</div>
                  <div className={`small fw-bold ${stock > 10 ? 'text-success' : stock > 0 ? 'text-warning' : 'text-danger'}`}>
                    {stock > 0 ? `${stock} unidades` : 'Agotado'}
                  </div>
                </div>
              </div>
            </div>

            {/* Precios */}
            {user ? (
              <div className="card bg-primary bg-opacity-10 border-primary border-opacity-10 mb-4" style={{ borderRadius: '1.5rem' }}>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-6">
                      <div className="extra-small text-primary text-uppercase fw-bold mb-1">Minorista</div>
                      <div className="h2 fw-bold text-dark mb-0">Bs. <span className="text-accent">{Number(product.precio_minorista).toFixed(2)}</span></div>
                    </div>
                    {product.precio_mayorista && (
                      <div className="col-6">
                        <div className="extra-small text-primary text-uppercase fw-bold mb-1">Mayorista</div>
                        <div className="h2 fw-bold text-dark mb-0">Bs. {Number(product.precio_mayorista).toFixed(2)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-dark border-secondary border-opacity-25 mb-4 text-center py-4" style={{ borderRadius: '1.5rem' }}>
                <span className="fs-4 d-block mb-2">🔒</span>
                <p className="mb-0 small text-muted">
                  <Link href="/login" className="text-primary fw-bold text-decoration-none">Iniciá sesión</Link> para ver los precios y realizar tu pedido.
                </p>
              </div>
            )}

            {/* Cantidad + Agregar */}
            {user && stock > 0 && (
              <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
                <div className="btn-group border border-secondary border-opacity-25 rounded-pill p-1 bg-dark shadow-sm" style={{ maxWidth: '160px' }}>
                  <button className="btn btn-dark rounded-circle border-0 py-2 fs-5" onClick={() => setCantidad(q => Math.max(1, q - 1))}>−</button>
                  <span className="btn btn-dark border-0 disabled opacity-100 fw-bold fs-5 px-3 min-w-40">{cantidad}</span>
                  <button className="btn btn-dark rounded-circle border-0 py-2 fs-5" onClick={() => setCantidad(q => Math.min(stock, q + 1))}>+</button>
                </div>
                <button className={`btn btn-primary btn-lg flex-grow-1 rounded-pill fw-bold shadow-sm transition-scale ${added ? 'btn-success' : ''}`} onClick={handleAdd}>
                  {added ? '✓ ¡Agregado!' : '+ Agregar al carrito'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .extra-small { font-size: 0.65rem; }
        .min-w-40 { min-width: 40px; }
        .object-fit-cover { object-fit: cover; }
      `}</style>
    </div>
  );
}
