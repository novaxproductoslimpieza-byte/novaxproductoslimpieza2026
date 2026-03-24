'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const path = usePathname();

  return (
    <nav className="navbar glass navbar-expand-lg navbar-dark fixed-top border-bottom border-secondary border-opacity-10 py-2">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2 py-1">
          <img
            src="images/config_web/logonovax.png"
            alt="Novax Logo"
            height="46"
            className="d-inline-block align-top rounded-2"
          />
          <span className="fw-bold fs-4 d-none d-sm-inline">Nova<span className="text-primary">x</span></span>
        </Link>

        {/* Search Bar - hidden on mobile, shown in menu toggle */}
        <div className="d-none d-lg-flex grow mx-4 max-w-lg">
          <div className="position-relative w-100">
            <span className="position-absolute translate-middle-y top-50 inset-s-0 ps-3 text-muted">🔍</span>
            <input
              className="form-control ps-5 rounded-pill border-secondary border-opacity-10 bg-card2 text-light w-100"
              style={{ height: '40px', maxWidth: '400px' }}
              placeholder="Buscar productos..."
            />
          </div>
        </div>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNovax"
          aria-controls="navbarNovax"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNovax">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-2">
            <li className="nav-item">
              <Link href="/" className={`nav-link px-3 ${path === '/' ? 'active text-primary fw-bold' : ''}`}>Catálogo</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link href="/orders" className={`nav-link px-3 ${path.startsWith('/orders') ? 'active text-primary fw-bold' : ''}`}>Pedidos</Link>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link href="/admin" className={`nav-link px-3 ${path.startsWith('/admin') ? 'active text-primary fw-bold' : ''}`}>Admin</Link>
              </li>
            )}

            <li className="nav-item ms-lg-2">
              <Link href="/cart" className="nav-link p-0">
                <Button variant="secondary" className="position-relative rounded-pill">
                  🛒
                  {itemCount > 0 && (
                    <span className="position-absolute top-0 inset-s-full translate-middle badge rounded-pill bg-primary border border-dark" style={{ fontSize: '0.65rem' }}>
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </li>

            <li className="nav-item ms-lg-2">
              {user ? (
                <div className="d-flex align-items-center gap-3 ps-lg-3 py-2 border-start border-secondary border-opacity-20">
                  <Link href="/profile" className="text-light text-decoration-none small">
                    Hola, <span className="text-accent fw-bold">{user.nombre.split(' ')[0]}</span>
                  </Link>
                  <Button variant="outline" size="sm" onClick={logout} className="border-danger text-danger border-opacity-30">Salir</Button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 ps-lg-3">
                  <Link href="/login" className="text-light text-decoration-none small px-2">Entrar</Link>
                  <Link href="/register">
                    <Button size="sm" className="px-4">Unirse</Button>
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
