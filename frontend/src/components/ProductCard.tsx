import React from 'react';
import Link from 'next/link';
import Button from './ui/Button';

interface ProductCardProps {
  product: {
    id: number;
    nombre: string;
    imagen?: string;
    subcategoria?: { nombre: string };
    precio_minorista?: number;
    stock: number;
  };
  onAddToCart: (product: any) => void;
  userLoggedIn: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, userLoggedIn }) => {
  const getStockInfo = (stock: number) => {
    if (stock === 0) return { label: 'Sin stock', cls: 'danger' };
    if (stock < 10) return { label: `Últimas ${stock} unidades`, cls: 'warning' };
    return { label: `${stock} disponibles`, cls: 'success' };
  };

  const stockInfo = getStockInfo(product.stock);

  return (
    <div className="card h-100 bg-white border-secondary border-opacity-25 shadow-sm product-card-hover overflow-hidden transition-all" style={{ borderRadius: 'var(--radius)' }}>
      <Link href={`/products/${product.id}`} className="text-decoration-none">
        <div className="card-img-top bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center border-bottom border-secondary border-opacity-10 overflow-hidden" style={{ height: '200px' }}>
          {product.imagen ? (
            <img 
              src={product.imagen} 
              alt={product.nombre} 
              className="img-fluid h-100 w-100 object-fit-cover transition-scale" 
            />
          ) : (
            <span className="display-4 opacity-50">🧴</span>
          )}
        </div>
        <div className="card-body p-3 d-flex flex-column">
          <h5 className="card-title text-dark mb-1 fs-6 fw-bold text-truncate">{product.nombre}</h5>
          <p className="card-text text-muted small mb-2">{product.subcategoria?.nombre}</p>
          <div className="mt-auto">
            {product.precio_minorista !== undefined ? (
              <div className="h5 text-primary-dark fw-bold mb-1">Bs. {Number(product.precio_minorista).toFixed(2)}</div>
            ) : (
              <div className="small text-muted fst-italic mb-1">🔒 Inicia sesión para ver precio</div>
            )}
            <span className={`badge rounded-pill bg-${stockInfo.cls} bg-opacity-10 text-${stockInfo.cls}`}>
              {stockInfo.label}
            </span>
          </div>
        </div>
      </Link>
      <div className="card-footer bg-transparent border-0 p-3 pt-0">
        <Button
          className="w-100 py-2 fw-bold"
          disabled={product.stock === 0 || !userLoggedIn}
          onClick={() => onAddToCart(product)}
        >
          {!userLoggedIn ? '🔒 Inicia sesión' : product.stock === 0 ? 'Sin stock' : '+ Agregar al carrito'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
