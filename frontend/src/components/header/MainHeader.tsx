'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { catalogApi } from '../../lib/api';
import {
  Menu, ChevronRight, ChevronDown, Package, User, LogOut,
  MapPin, CreditCard, Info, Tag, LayoutDashboard
} from 'lucide-react';


export default function MainHeader() {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Sidebar state
  const [categories, setCategories] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const [activeSubId, setActiveSubId] = useState<number | null>(null);
  const [activeCatTop, setActiveCatTop] = useState(0);
  const [activeSubTop, setActiveSubTop] = useState(0);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const sidebarContentRef = React.useRef<HTMLDivElement>(null);

  const handleAdminLinkClick = () => {
    setIsAdminMenuOpen(false);
  };

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleCategoryClick = (id: number | null, subId: number | null = null) => {
    setIsSidebarOpen(false);
    setActiveCatId(null);
    setActiveSubId(null);

    if (id === null) {
      router.push('/');
    } else {
      let url = `/?category_id=${id}`;
      if (subId) url += `&subcategory_id=${subId}`;
      router.push(url);
    }
  };

  const currentActiveCat = categories.find(c => c.id === activeCatId);
  const currentActiveSub = currentActiveCat?.subcategorias?.find((s: any) => s.id === activeSubId);

  return (
    <div className="bg-white py-2 shadow-sm border-bottom border-light" style={{ zIndex: 1050, position: 'relative' }}>
      <div className="container">
        <ul className="nav d-flex align-items-center gap-4 m-0 p-0" style={{ listStyle: 'none' }}>

          {/* Sidebar Trigger (Menu) */}
          {isHomePage && (
            <li
              className="nav-item position-relative"
              onMouseEnter={() => setIsSidebarOpen(true)}
              onMouseLeave={() => {
                setIsSidebarOpen(false);
                setActiveCatId(null);
                setActiveSubId(null);
              }}
            >
              <button
                className="btn btn-primary-dark text-white text-decoration-none d-flex align-items-center gap-2 py-2 px-3 fw-bold small rounded border-0 shadow-sm transition-all hover-bright"
              >
                <Menu size={18} /> <span className="d-none d-sm-inline">Todas</span>
              </button>

              {/* Overlay oscuro para fondo (clic para cerrar) */}
              <div
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              ></div>

              {/* Sidebar / Menú Lateral Offcanvas */}
              <div className={`sidebar-container border-end border-light ${isSidebarOpen ? 'open' : ''}`}>
                <div ref={sidebarContentRef} className="sidebar-content hide-scrollbar overflow-auto h-100">
                  {/* 1. Identidad de Usuario */}
                  <div
                    className="user-section p-3 bg-light border-bottom border-light"
                    onMouseEnter={() => { setActiveCatId(null); setActiveSubId(null); }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar bg-primary-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                        <User size={20} />
                      </div>
                      <div className="user-info overflow-hidden">
                        <div className="fw-bold text-dark text-truncate small">
                          {user ? user.nombre : 'Bienvenido'}
                        </div>
                        <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>
                          {user ? user.correo : 'Inicia sesión'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Buscar por Departamento */}
                  <div
                    className="section-title px-3 pt-3 pb-2 text-primary-dark fw-bold"
                    style={{ fontSize: '12px', letterSpacing: '0.5px' }}
                    onMouseEnter={() => { setActiveCatId(null); setActiveSubId(null); }}
                  >
                    BUSCAR POR DEPARTAMENTO
                  </div>
                  <div className="dept-list px-2 pb-2">
                    {categories.map((cat: any) => (
                      <div
                        key={cat.id}
                        className="dept-item-wrapper"
                        onMouseEnter={(e) => {
                          setActiveCatId(cat.id);
                          setActiveSubId(null);
                          const scrollTop = sidebarContentRef.current?.scrollTop || 0;
                          setActiveCatTop(e.currentTarget.offsetTop - scrollTop);
                        }}
                      >
                        <button
                          onClick={() => handleCategoryClick(cat.id)}
                          className={`btn-flat w-100 d-flex align-items-center justify-content-between py-2 px-3 fw-bold small mb-1 ${activeCatId === cat.id ? 'bg-light text-primary-dark' : ''}`}
                        >
                          <span className="d-flex align-items-center gap-2">
                            <Package size={16} className={activeCatId === cat.id ? 'text-primary' : 'text-muted'} />
                            {cat.nombre}
                          </span>
                          {cat.subcategorias?.length > 0 && <ChevronRight size={14} className="text-muted" />}
                        </button>

                      </div>
                    ))}
                  </div>

                  <hr className="mx-3 my-2 text-muted opacity-25" onMouseEnter={() => { setActiveCatId(null); setActiveSubId(null); }} />

                  {/* 3. Ayuda / Soporte */}
                  <div
                    className="section-title px-3 py-2 text-primary-dark fw-bold"
                    style={{ fontSize: '12px', letterSpacing: '0.5px' }}
                    onMouseEnter={() => { setActiveCatId(null); setActiveSubId(null); }}
                  >
                    AYUDA Y SOPORTE
                  </div>
                  <div className="px-2 pb-2" onMouseEnter={() => { setActiveCatId(null); setActiveSubId(null); }}>
                    <Link href="/promociones" onClick={() => setIsSidebarOpen(false)} className="d-flex align-items-center gap-3 text-dark text-decoration-none small py-2 px-3 hover-bg-light rounded fw-bold">
                      <Tag size={16} className="text-muted" /> Ofertas
                    </Link>
                    <Link href="/sucursales" onClick={() => setIsSidebarOpen(false)} className="d-flex align-items-center gap-3 text-dark text-decoration-none small py-2 px-3 hover-bg-light rounded fw-bold">
                      <MapPin size={16} className="text-muted" /> Sucursales
                    </Link>
                    <Link href="/pagos" onClick={() => setIsSidebarOpen(false)} className="d-flex align-items-center gap-3 text-dark text-decoration-none small py-2 px-3 hover-bg-light rounded fw-bold">
                      <CreditCard size={16} className="text-muted" /> Formas de pago
                    </Link>
                    <Link href="/nosotros" onClick={() => setIsSidebarOpen(false)} className="d-flex align-items-center gap-3 text-dark text-decoration-none small py-2 px-3 hover-bg-light rounded fw-bold">
                      <Info size={16} className="text-muted" /> Nosotros
                    </Link>
                  </div>

                  {/* 4. Configuración */}
                  {user && (
                    <>
                      <hr className="mx-3 my-2 text-muted opacity-25" />
                      <div className="section-title px-3 py-2 text-primary-dark fw-bold" style={{ fontSize: '12px' }}>CONFIGURACIÓN</div>
                      <div className="px-2 pb-3">
                        <Link href="/profile" onClick={() => setIsSidebarOpen(false)} className="d-flex align-items-center gap-3 text-dark text-decoration-none small py-2 px-3 hover-bg-light rounded fw-bold">
                          <User size={16} className="text-muted" /> Tu cuenta
                        </Link>
                        <button onClick={() => { logout(); setIsSidebarOpen(false); }} className="btn btn-link w-100 d-flex align-items-center gap-3 text-danger text-decoration-none small py-2 px-3 hover-bg-light rounded fw-bold border-0 shadow-none">
                          <LogOut size={16} /> Cerrar sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Flyout Layer 2: Subcategorías */}
                {isSidebarOpen && currentActiveCat && currentActiveCat.subcategorias?.length > 0 && (
                  <div
                    className="flyout-submenu bg-white shadow-lg border border-light p-2 rounded show"
                    style={{ top: activeCatTop }}
                    onMouseLeave={() => setActiveSubId(null)}
                  >
                    <div className="px-3 py-1 border-bottom border-light mb-1 fw-bold text-primary-dark text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      {currentActiveCat.nombre}
                    </div>
                    {currentActiveCat.subcategorias.map((sub: any) => (
                      <div
                        key={sub.id}
                        className="sub-item-wrapper"
                        onMouseEnter={(e) => {
                          setActiveSubId(sub.id);
                          setActiveSubTop(e.currentTarget.offsetTop);
                        }}
                      >
                        <button
                          onClick={() => handleCategoryClick(currentActiveCat.id, sub.id)}
                          className={`btn btn-link text-dark text-decoration-none w-100 text-start py-2 px-3 small rounded border-0 fw-bold transition-all ${activeSubId === sub.id ? 'bg-light text-primary-dark' : 'hover-bg-light'
                            }`}
                        >
                          {sub.nombre}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>
          )}
          {/* Enlace Administrador con Popup Multinivel */}
          {isAdmin && (
            <li
              className="nav-item position-relative admin-dropdown"
              onMouseEnter={() => setIsAdminMenuOpen(true)}
              onMouseLeave={() => setIsAdminMenuOpen(false)}
            >
              <Link
                href="/admin"
                className="btn btn-link text-primary-dark fw-bold text-decoration-none small hover-text-primary px-2 transition-all d-flex align-items-center gap-1 border-0 shadow-none"
                onClick={handleAdminLinkClick}
              >
                <LayoutDashboard size={16} /> Administrador <ChevronDown size={14} className="chevron-rotate" />
              </Link>
              <div
                className="dropdown-menu-custom position-absolute top-100 inset-s-0 mt-0 py-2 bg-white rounded shadow-lg border border-light z-3"
                style={{ minWidth: '220px', display: isAdminMenuOpen ? 'block' : 'none' }}
              >
                <Link href="/admin/orders" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                  Pedidos
                </Link>
                <Link href="/admin/clients" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                  Clientes
                </Link>

                {/* Nivel 2: Productos */}
                <div className="position-relative dropdown-hover-sub">
                  <div className="d-flex align-items-center justify-content-between text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold cursor-pointer">
                    Productos <ChevronRight size={14} />
                  </div>
                  <div className="dropdown-submenu position-absolute top-0 start-100 mt-0 py-2 bg-white rounded shadow border border-light z-3" style={{ minWidth: '200px' }}>
                    <Link href="/admin/products" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Producto
                    </Link>
                    <Link href="/admin/categories" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Grupo Producto
                    </Link>
                    <Link href="/admin/categories" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold text-truncate">
                      Subgrupo Producto
                    </Link>
                  </div>
                </div>

                {/* Nivel 2: Usuarios */}
                <div className="position-relative dropdown-hover-sub">
                  <div className="d-flex align-items-center justify-content-between text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold cursor-pointer">
                    Usuarios <ChevronRight size={14} />
                  </div>
                  <div className="dropdown-submenu position-absolute top-0 start-100 mt-0 py-2 bg-white rounded shadow border border-light z-3" style={{ minWidth: '180px' }}>
                    <Link href="/register" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Cuentas
                    </Link>
                    <Link href="/admin/roles" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Tipo de cuentas
                    </Link>
                  </div>
                </div>

                {/* Nivel 2: Geoubicacion */}
                <div className="position-relative dropdown-hover-sub">
                  <div className="d-flex align-items-center justify-content-between text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold cursor-pointer">
                    Geoubicacion <ChevronRight size={14} />
                  </div>
                  <div className="dropdown-submenu position-absolute top-0 start-100 mt-0 py-2 bg-white rounded shadow border border-light z-3" style={{ minWidth: '180px' }}>
                    <Link href="/admin/geoubicacion/cliente" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Cliente
                    </Link>
                    <Link href="/admin/geoubicacion" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Mapa Clientes
                    </Link>
                    <Link href="/admin/geoubicacion/departamentos" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Departamentos
                    </Link>
                    <Link href="/admin/geoubicacion/provincias" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Provincias
                    </Link>
                    <Link href="/admin/geoubicacion/zonas" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Zonas
                    </Link>
                  </div>
                </div>

                {/* Nivel 2: Reportes */}
                <div className="position-relative dropdown-hover-sub">
                  <div className="d-flex align-items-center justify-content-between text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold cursor-pointer">
                    Reportes <ChevronRight size={14} />
                  </div>
                  <div className="dropdown-submenu position-absolute top-0 start-100 mt-0 py-2 bg-white rounded shadow border border-light z-3" style={{ minWidth: '180px' }}>
                    <Link href="/admin/reportes/ventas" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Ventas
                    </Link>
                    <Link href="/admin/reportes/stock" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Stock Almacenes
                    </Link>
                    <Link href="/admin/reportes/clientes" onClick={handleAdminLinkClick} className="d-block text-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold">
                      Lista Clientes
                    </Link>
                  </div>
                </div>

                <Link href="/admin" onClick={handleAdminLinkClick} className="d-block text-primary-dark text-decoration-none small py-2 px-3 hover-bg-light fw-bold border-top border-light mt-1">
                  Dashboard
                </Link>
              </div>
            </li>
          )}
          {/* Nuevos enlaces (Acerca de, Productos, vender, Como Funciona ,  Sobre empresa) */}
          {/*Acerca del sitio web Novax */}
          <li>
            <Link href="/acercade" className="nav-main-link text-dark fw-bold text-decoration-none small px-2 d-flex align-items-center">
              Acerca de
            </Link>
          </li>
          {/*Productos que se venden en Novax */}
          <li>
            <Link href="/productosinfo" className="nav-main-link text-dark fw-bold text-decoration-none small px-2 d-flex align-items-center">
              Productos Info
            </Link>
          </li>
          {/*Sobre empresa Novax */}
          <li>
            <Link href="/sobreempresa" className="nav-main-link text-dark fw-bold text-decoration-none small px-2 d-flex align-items-center">
              SobreEmpresa
            </Link>
          </li>
          {/*Noticias de Novax */}
          <li>
            <Link href="/noticias" className="nav-main-link text-dark fw-bold text-decoration-none small px-2 d-flex align-items-center">
              Noticias
            </Link>
          </li>

          {/* isAdmin controla que solo los administradores puedan ver el enlace de vender */}
          {(isAdmin || user) && (
            <li>
              <Link href="/vender" className="nav-main-link text-dark fw-bold text-decoration-none small px-2 d-flex align-items-center">
                Vender
              </Link>
            </li>
          )}


        </ul>
      </div>

      <style jsx>{`
        .btn-primary-dark { background-color: var(--primary-dark); }
        .hover-bright:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .hover-text-primary:hover { color: var(--primary-dark) !important; }
        .hover-bg-light:hover { background-color: #f8fafc; color: var(--primary-dark) !important; }
        .transition-all { transition: all 0.2s ease-in-out; }

        /* Nav Link Hover Profesional */
        .nav-main-link {
          position: relative;
          color: #1e293b;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 6px 12px;
          border-radius: 8px;
        }
        .nav-main-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--primary-dark, #1e40af);
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-main-link:hover {
          color: var(--primary-dark, #1e40af) !important;
          background: rgba(30, 64, 175, 0.05);
        }
        .nav-main-link:hover::after {
          width: 60%;
          left: 20%;
        }

        /* Estilos del Sidebar Offcanvas */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease-in-out;
          z-index: 1050;
        }
        .sidebar-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .sidebar-container {
          position: fixed;
          top: 0;
          left: -320px;
          width: 300px;
          height: 100vh;
          overflow: visible;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1051;
          background: white;
          box-shadow: 4px 0 15px rgba(0,0,0,0.1);
        }
        .sidebar-container.open {
          left: 0;
        }
        .sidebar-content {
          height: 100%;
          padding-bottom: 2rem;
          overflow-y: auto;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .flyout-submenu {
          position: absolute;
          left: 100%;
          width: 250px;
          min-height: 100px;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-10px);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1060;
        }
        .flyout-submenu.show {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
        
        /* Estilos Submenú Nivel 2 Administrador */
        .dropdown-submenu {
          display: none;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s;
        }
        .dropdown-hover-sub:hover .dropdown-submenu {
          display: block;
          opacity: 1;
          visibility: visible;
        }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
}
