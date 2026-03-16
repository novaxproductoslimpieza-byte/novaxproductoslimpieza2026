'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { catalogApi } from '../../lib/api';
import { LogIn, User, ShoppingBag, LogOut, ChevronDown, Search } from 'lucide-react';

export default function TopBar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search state
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState('Todas');
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const catId = searchParams.get('category_id');
      if (catId) {
        const cat = categories.find(c => c.id === Number(catId));
        if (cat) {
          setSelectedCat(cat.nombre);
          setSelectedCatId(cat.id);
        }
      } else {
        setSelectedCat('Todas');
        setSelectedCatId(null);
      }
    }
    setSearchTerm(searchParams.get('search') || '');
  }, [categories, searchParams]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCatId) params.set('category_id', String(selectedCatId));
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="bg-navbar py-2 border-bottom border-secondary border-opacity-10 position-relative z-index-top">
      <div className="container d-flex justify-content-between align-items-center gap-3">
        {/* Logo */}
        <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none hover-scale flex-shrink-0">
          <img src="/images/config_web/logonovax.png" alt="Novax" height="40" className="rounded-1 shadow-sm" />
          <span className="fw-bold text-white fs-5 font-outfit d-none d-lg-inline">Nova<span className="text-primary-dark">x</span></span>
        </Link>

        {/* Search Bar MOVED FROM MAIN HEADER */}
        <form onSubmit={handleSearch} className="d-flex align-items-center bg-white rounded-pill overflow-hidden shadow-sm flex-grow-1 mx-lg-4" style={{ maxWidth: '600px', height: '42px' }}>
          {/* Selector de Categoría con Hover CSS */}
          <div className="dropdown-hover h-100 position-relative border-end border-light d-none d-md-block">
            <button 
              type="button"
              className="btn-category-selector h-100 px-3 d-flex align-items-center gap-2"
              style={{ minWidth: '130px' }}
            >
              <span className="text-truncate fw-bold small text-dark">{selectedCat}</span>
              <ChevronDown size={14} className="text-primary-dark chevron-icon" />
            </button>
            <div className="dropdown-menu-custom position-absolute top-100 start-0 mt-0 p-2 bg-white rounded shadow-lg border border-light z-3" style={{ minWidth: '200px' }}>
              <button 
                type="button"
                className="btn btn-link text-dark text-decoration-none w-100 text-start small py-2 px-3 hover-bg-light rounded fw-bold"
                onClick={() => { 
                  setSelectedCat('Todas'); 
                  setSelectedCatId(null); 
                  const params = new URLSearchParams();
                  if (searchTerm) params.set('search', searchTerm);
                  router.push(`/?${params.toString()}`);
                }}
              >
                Todas las categorías
              </button>
              {categories.map((cat: any) => (
                <button 
                  key={cat.id}
                  type="button"
                  className="btn btn-link text-dark text-decoration-none w-100 text-start small py-2 px-3 hover-bg-light rounded fw-bold"
                  onClick={() => { 
                    setSelectedCat(cat.nombre); 
                    setSelectedCatId(cat.id); 
                    const params = new URLSearchParams();
                    if (searchTerm) params.set('search', searchTerm);
                    params.set('category_id', String(cat.id));
                    router.push(`/?${params.toString()}`);
                  }}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          <input 
            type="text" 
            className="form-control bg-transparent border-0 text-dark shadow-none px-3 h-100 fw-bold small" 
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button type="submit" className="btn btn-primary-dark rounded-0 px-3 h-100 d-flex align-items-center justify-content-center border-0 text-white hover-bright">
            <Search size={18} strokeWidth={2.5} />
          </button>
        </form>

        <div className="d-flex align-items-center gap-3 flex-shrink-0">
          {/* Idioma */}
          <div className="dropdown-hover position-relative d-none d-md-block">
            <button
              className="btn btn-link text-white text-decoration-none p-0 d-flex align-items-center gap-1 small fw-bold font-inter"
            >
              <img src="/images/config_web/flags/es.svg" alt="ES" width="20" height="20" className="rounded-circle shadow-sm object-fit-cover" />
              <span className="d-none d-lg-inline">ES</span>
              <ChevronDown size={14} className="chevron-icon" />
            </button>
            <div className="dropdown-menu-custom position-absolute top-100 start-0 mt-0 p-2 bg-white rounded shadow-lg border border-secondary border-opacity-10 z-3">
              <button className="btn btn-link text-dark text-decoration-none w-100 text-start d-flex align-items-center gap-2 small py-2 px-3 hover-bg-light rounded fw-bold">
                <img src="/images/config_web/flags/es.svg" alt="ES" width="16" height="16" className="rounded-circle" /> Español
              </button>
              <button className="btn btn-link text-muted text-decoration-none w-100 text-start d-flex align-items-center gap-2 small py-2 px-3 opacity-50 cursor-not-allowed fw-bold">
                <img src="/images/config_web/flags/us.svg" alt="US" width="16" height="16" className="rounded-circle" /> English
              </button>
            </div>
          </div>

          {/* Cuenta */}
          <div className="dropdown-hover position-relative">
            {user ? (
              <>
                <button
                  className="btn btn-link text-white text-decoration-none p-0 d-flex align-items-center gap-1 small fw-bold font-inter"
                >
                  <User size={18} className="text-primary-dark opacity-100 bg-white rounded-circle p-1" />
                  <span className="d-none d-md-inline text-truncate text-white" style={{maxWidth: '100px'}}>{user.nombre.split(' ')[0]}</span>
                  <ChevronDown size={14} className="chevron-icon d-none d-md-inline text-white" />
                </button>
                <div className="dropdown-menu-custom position-absolute top-100 end-0 mt-0 p-3 bg-white rounded shadow-lg border border-secondary border-opacity-10 z-3" style={{ minWidth: '200px' }}>
                  <div className="mb-2 pb-2 border-bottom border-light">
                    <p className="text-dark fw-bold mb-0 small text-truncate">{user.nombre}</p>
                    <p className="text-muted mb-0 text-truncate" style={{ fontSize: '0.75rem' }}>{user.correo}</p>
                  </div>
                  <Link href="/profile" className="d-flex align-items-center gap-2 text-dark text-decoration-none small py-2 px-2 hover-bg-light rounded fw-bold">
                    <User size={16} className="text-primary-dark" /> Tu perfil
                  </Link>
                  <Link href="/orders" className="d-flex align-items-center gap-2 text-dark text-decoration-none small py-2 px-2 hover-bg-light rounded fw-bold">
                    <ShoppingBag size={16} className="text-primary-dark" /> Tus pedidos
                  </Link>
                  <button
                    onClick={logout}
                    className="btn btn-link p-0 d-flex align-items-center gap-2 text-danger text-decoration-none small py-2 px-2 w-100 text-start hover-bg-danger-light rounded mt-1 fw-bold"
                  >
                    <LogOut size={16} /> Cierre de sesión
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login" className="text-white text-decoration-none d-flex align-items-center gap-1 small fw-bold font-inter hover-text-primary">
                <LogIn size={20} className="text-primary-dark bg-white rounded-circle p-1 shadow-sm" /> 
                <span className="d-none d-md-inline">Cuenta</span>
              </Link>
            )}
          </div>

          {/* Carrito */}
          <Link href="/cart" className="text-white text-decoration-none d-flex align-items-center gap-2 small position-relative fw-bold font-inter hover-scale">
            <div className="position-relative">
              <img src="/images/config_web/carrito.jpg" alt="Cart" width="26" height="26" className="rounded-circle object-fit-cover shadow-sm border border-white" />
              {itemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm border border-white" style={{ fontSize: '0.65rem', padding: '0.35em 0.5em', zIndex: 5 }}>
                  {itemCount}
                </span>
              )}
            </div>
            <span className="d-none d-lg-inline">Carrito</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .z-index-top { z-index: 1100; }
        .dropdown-menu-custom {
          display: none;
          min-width: 150px;
          animation: fadeIn 0.15s ease-out;
          pointer-events: auto;
        }
        .dropdown-hover:hover .dropdown-menu-custom {
          display: block;
        }
        .dropdown-hover:hover .chevron-icon {
          transform: rotate(180deg);
        }
        .chevron-icon {
          transition: transform 0.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hover-bg-light:hover { background-color: #f8fafc; color: var(--primary-dark) !important; }
        .hover-bg-danger-light:hover { background-color: #fef2f2; }
        
        .btn-category-selector {
          background: #fdfdfd;
          border: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-category-selector:hover { background: #f8fafc; }
        .btn-primary-dark { background-color: var(--primary-dark); transition: all 0.3s; }
        .btn-primary-dark:hover { background-color: #1a44c2; }
        .hover-bright:hover { filter: brightness(1.1); }
      `}</style>
    </div>
  );
}
