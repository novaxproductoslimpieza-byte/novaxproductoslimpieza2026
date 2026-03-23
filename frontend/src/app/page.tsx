'use client';
import React, { Suspense, useEffect, useState } from 'react';

import { useSearchParams, useRouter } from 'next/navigation';

import { catalogApi } from '../lib/api';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';
import HeroCarousel from '../components/HeroCarousel';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowRight, Package } from 'lucide-react';

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState<{ [key: string]: any[] }>({});
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSubCatId, setSelectedSubCatId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const search = searchParams.get('search') || undefined;
        const categoryId = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : undefined;
        const subCatId = searchParams.get('subcategory_id') ? parseInt(searchParams.get('subcategory_id')!) : undefined;
        
        setSelectedSubCatId(subCatId || null);

        const data = await catalogApi.getProducts({ 
          category_id: categoryId, 
          subcategory_id: subCatId, 
          search 
        });
        setProducts(data);

        // Fetch subcategories if a category is selected
        if (categoryId) {
          const allCats = await catalogApi.getCategories();
          const currentCat = allCats.find((c: any) => c.id === categoryId);
          if (currentCat) {
            setSubcategories(currentCat.subcategorias || []);
          }
        } else {
          setSubcategories([]);
        }

        // Group products by category name for browsing view
        if (!search && !categoryId && !subCatId) {
          const groups: { [key: string]: any[] } = {};
          data.forEach((p: any) => {
            const catName = p.subcategoria?.categoria?.nombre || 'Otros';
            if (!groups[catName]) groups[catName] = [];
            groups[catName].push(p);
          });
          setGroupedProducts(groups);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
  };

  if (loading) {
    return (
      <div className="container py-5 mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary-dark" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando catálogo NOVAX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container pb-5">
      {/* Hero only on main home */}
      {!searchParams.get('search') && !searchParams.get('category_id') && (
        <section className="mb-5">
          <HeroCarousel />
        </section>
      )}

      {/* Browsing State: Show Carousels by Category */}
      {!searchParams.get('search') && !searchParams.get('category_id') && (
        <div className="category-sections">
          {/* Contador de Grupos (Punto 9.2 de mejoras_home.md) */}
          <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded-4 shadow-sm border border-light">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                <Package size={18} />
              </div>
              <div>
                <span className="fw-bold text-dark d-block leading-tight">Catálogo General</span>
                <span className="text-muted small">Explora nuestras categorías principales</span>
              </div>
            </div>
            <div className="text-end">
              <span className="badge bg-primary-dark rounded-pill px-3 py-2 fw-bold">
                {Object.keys(groupedProducts).length} Grupos de productos
              </span>
            </div>
          </div>

          {Object.entries(groupedProducts).length > 0 ? (
            Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
              <section key={categoryName} className="mb-5 pb-3">
                <div className="d-flex justify-content-between align-items-end mb-4 border-bottom border-light pb-2">
                  <div>
                    <h2 className="fw-bold text-dark mb-1 h3">{categoryName}</h2>
                    <p className="text-muted small mb-0">Lo mejor en productos de {categoryName.toLowerCase()}</p>
                  </div>
                  <button 
                    onClick={() => {
                      const catId = categoryProducts[0]?.subcategoria?.categoria?.id;
                      if (catId) {
                        const params = new URLSearchParams();
                        params.set('category_id', catId.toString());
                        router.push(`/?${params.toString()}`);
                      }
                    }}
                    className="btn-ver-todo d-flex align-items-center gap-1"
                  >
                    Ver todo <ArrowRight size={14} />
                  </button>
                </div>
                
                <ProductCarousel 
                  products={categoryProducts} 
                  onAddToCart={handleAddToCart}
                  userLoggedIn={!!user}
                />
              </section>
            ))
          ) : (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-light my-5">
              <Package size={48} className="text-muted mb-3 opacity-25" />
              <h3 className="h5 fw-bold">El catálogo está vacío</h3>
              <p className="text-muted">No se encontraron productos disponibles en este momento.</p>
            </div>
          )}
        </div>
      )}

      {/* Search/Filter Results State */}
      {(searchParams.get('search') || searchParams.get('category_id')) && (
        <div className="search-results py-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <button 
              onClick={() => router.push('/')}
              className="btn btn-light rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
              title="Volver"
            >
              <ArrowRight size={20} className="rotate-180" />
            </button>
            <div>
              <h2 className="fw-bold mb-0 text-dark h2">
                {searchParams.get('search') 
                  ? `Búsqueda: "${searchParams.get('search')}"` 
                  : (subcategories.length > 0 ? (products[0]?.subcategoria?.categoria?.nombre || 'Catálogo') : 'Resultados')
                }
              </h2>
              <p className="text-muted mb-0">
                {selectedSubCatId 
                  ? `Mostrando productos de: ${subcategories.find(s => s.id === selectedSubCatId)?.nombre || '...'}`
                  : `${products.length} productos encontrados en total`
                }
              </p>
            </div>
          </div>

          {/* Subcategory Pills (Carousel) */}
          {subcategories.length > 0 && (
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 overflow-auto hide-scrollbar py-2">
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('subcategory_id');
                    router.push(`/?${params.toString()}`);
                  }}
                  className={`btn-filter-category ${!selectedSubCatId ? 'active' : ''}`}
                >
                  Todos
                </button>
                {subcategories.map((sub: any) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('subcategory_id', sub.id.toString());
                      router.push(`/?${params.toString()}`);
                    }}
                    className={`btn-filter-category ${selectedSubCatId === sub.id ? 'active' : ''}`}
                  >
                    {sub.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {products.length > 0 ? (
            <div className="results-container">
              {/* If a specific subcategory is selected, show its title */}
              {selectedSubCatId ? (
                <div className="subcategory-section mb-5">
                  <h3 className="h3 fw-bold text-dark mb-4 border-start border-4 border-info ps-3">
                    {subcategories.find(s => s.id === selectedSubCatId)?.nombre || 'Productos'}
                  </h3>
                  <div className="row g-4">
                    {products.map((product: any) => (
                      <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <ProductCard 
                          product={product} 
                          onAddToCart={handleAddToCart}
                          userLoggedIn={!!user}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchParams.get('category_id') ? (
                // Group by subcategory if in category view without sub-filter
                Object.entries(
                  products.reduce((acc: any, p: any) => {
                    const subName = p.subcategoria?.nombre || 'Otros';
                    if (!acc[subName]) acc[subName] = [];
                    acc[subName].push(p);
                    return acc;
                  }, {})
                ).map(([subName, subProducts]: [string, any]) => (
                  <div key={subName} className="subcategory-section mb-5">
                    <h3 className="h3 fw-bold text-dark mb-4 border-start border-4 border-info ps-3">
                      {subName}
                    </h3>
                    <div className="row g-4">
                      {subProducts.map((product: any) => (
                        <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                          <ProductCard 
                            product={product} 
                            onAddToCart={handleAddToCart}
                            userLoggedIn={!!user}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Standard flat grid for search results
                <div className="row g-4">
                  {products.map((product) => (
                    <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <ProductCard 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        userLoggedIn={!!user}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-light">
              <div className="mb-3">
                <Search size={48} className="text-muted opacity-25" />
              </div>
              <h3 className="h5 fw-bold text-dark">No se encontraron resultados</h3>
              <p className="text-muted mb-4">Lo sentimos, no hay productos que coincidan con tu criterio.</p>
              <button onClick={() => router.push('/')} className="btn btn-primary-dark rounded-pill px-4 fw-bold">
                Ver todo el catálogo
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .btn-filter-category {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
          padding: 8px 18px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .btn-filter-category:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #1e293b;
          transform: translateY(-1px);
        }
        .btn-filter-category.active {
          background: #0ea5e9; /* Celeste Corporativo */
          color: white;
          border-color: #0ea5e9;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }
        .btn-filter-category:active {
          transform: scale(0.95);
        }

        .btn-ver-todo {
          background: #eff6ff;
          color: var(--primary-dark);
          border: none;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-ver-todo:hover {
          background: #dbeafe;
          transform: translateY(-1px);
        }
        .btn-ver-todo:active {
          transform: scale(0.95);
        }
        .rotate-180 { transform: rotate(180deg); }
        .btn-primary-dark {
          background-color: var(--primary-dark);
          color: white;
          border: none;
          transition: all 0.2s;
        }
        .btn-primary-dark:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }
        .btn-primary-dark:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="container py-5 mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary-dark" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando catálogo NOVAX...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}

