'use client';
import React, { useState, useEffect } from 'react';
import { catalogApi } from '../../lib/api';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';



export default function NavigationBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCatId = searchParams.get('category_id');
  const [categories, setCategories] = useState<any[]>([]);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleCategoryClick = (id: number | null) => {
    if (id === null) {
      router.push('/');
    } else {
      router.push(`/?category_id=${id}`);
    }
  };

  return (
    <div className="bg-white border-bottom border-light py-2 shadow-sm sticky-top" style={{ zIndex: 1000 }}>
      <div className="container">
        {/* Carrusel de Categorías (Grupos) */}
{isHomePage && (
        <div className="category-carousel-container" style={{ overflow: 'hidden' }}>
          <div className="d-flex align-items-center gap-2 overflow-auto hide-scrollbar" style={{ whiteSpace: 'nowrap' }}>
            <button
              onClick={() => handleCategoryClick(null)}
              className={`btn-filter-category ${!currentCatId && !searchParams.get('search') ? 'active' : ''}`}
            >
              Todos
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`btn-filter-category ${Number(currentCatId) === cat.id ? 'active' : ''}`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

)}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .btn-filter-category {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
          padding: 8px 22px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          letter-spacing: 0.3px;
        }
        .btn-filter-category:hover {
          background: white;
          border-color: var(--primary-dark, #0ea5e9);
          color: var(--primary-dark, #0ea5e9);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .btn-filter-category.active {
          background: var(--primary-dark, #0ea5e9);
          color: white;
          border-color: var(--primary-dark, #0ea5e9);
          box-shadow: 0 6px 15px rgba(14, 165, 233, 0.4);
          transform: translateY(-1px);
        }
        .btn-filter-category:active {
          transform: translateY(0) scale(0.95);
        }
      `}</style>
    </div>
  );
}
