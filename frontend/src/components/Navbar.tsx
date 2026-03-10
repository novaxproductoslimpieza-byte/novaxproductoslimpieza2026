'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const path = usePathname();

  return (
    <nav className="navbar glass navbar-expand-lg navbar-dark sticky-top border-bottom border-secondary border-opacity-10 py-2">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2 py-1">
          <img 
            src="/logonovax.png" 
            alt="Novax Logo" 
            height="40" 
            className="d-inline-block align-top rounded-2 shadow-sm"
            onError={(e) => {
              (e.target as any).style.display = 'none';
              (e.target as any).parentElement.innerHTML += '<span class="fw-bold fs-3 text-primary">Nova<span class="text-accent">x</span></span>';
            }}
          />
        </Link>
        <button
          className="navbar-toggler"
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/" className={`nav-link px-3 ${path === '/' ? 'active text-primary' : ''}`}>Catálogo</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link href="/orders" className={`nav-link px-3 ${path.startsWith('/orders') ? 'active text-primary' : ''}`}>Mis Pedidos</Link>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link href="/admin" className={`nav-link px-3 ${path.startsWith('/admin') ? 'active text-primary' : ''}`}>Admin</Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <Link href="/cart" className="btn btn-outline-light position-relative d-flex align-items-center gap-2">
              🛒 <span className="d-none d-sm-inline">Carrito</span>
              {itemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <Link href="/profile" className="text-light text-decoration-none small">
                  Hola, <span className="text-accent fw-semibold">{user.nombre.split(' ')[0]}</span>
                </Link>
                <button className="btn btn-outline-danger btn-sm" onClick={logout}>Salir</button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link href="/login" className="btn btn-link text-light text-decoration-none p-0">Entrar</Link>
                <Link href="/register" className="btn btn-primary btn-sm rounded-pill px-4">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
