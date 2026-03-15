'use client';
import { useState, useEffect } from 'react';
import { catalogApi } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import HeroCarousel from '../components/HeroCarousel';
import CategoryChips from '../components/CategoryChips';
import ProductCard from '../components/ProductCard';

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

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <HeroCarousel />

      <section id="productos">
        {/* Filtros y Buscador */}
        <div className="row mb-5 g-4 align-items-center">
          <div className="col-lg-4">
            <h2 className="fs-3 fw-bold mb-0">Nuestros <span className="text-primary">Productos</span></h2>
            <p className="text-muted small mb-0">Explora nuestro catálogo completo</p>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="position-relative">
              <span className="position-absolute translate-middle-y top-50 start-0 ps-3 text-muted">🔍</span>
              <input
                className="form-control ps-5 rounded-pill border-secondary border-opacity-10 bg-card2 text-light"
                style={{ height: '48px' }}
                placeholder="Buscar productos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-5">
            <div className="d-flex justify-content-md-end">
              <CategoryChips 
                categories={categories} 
                selectedId={selectedCat} 
                onSelect={setSelectedCat} 
              />
            </div>
          </div>
        </div>

        {/* Grid de Productos */}
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
          <div className="text-center py-5 glass rounded-4 my-5">
            <div className="display-1 mb-3 opacity-50">📦</div>
            <h3 className="text-muted">No se encontraron productos</h3>
            <p className="text-secondary">Intenta con otros filtros de búsqueda o categorías.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {products.map(product => (
              <div key={product.id} className="col">
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart} 
                  userLoggedIn={!!user} 
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
