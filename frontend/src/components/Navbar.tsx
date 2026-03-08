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
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">Nova<span>x</span></Link>
        <div className="navbar-links">
          <Link href="/" className={`nav-link ${path === '/' ? 'active' : ''}`}>Catálogo</Link>
          {user && (
            <Link href="/orders" className={`nav-link ${path.startsWith('/orders') ? 'active' : ''}`}>Mis Pedidos</Link>
          )}
          {isAdmin && (
            <Link href="/admin" className={`nav-link ${path.startsWith('/admin') ? 'active' : ''}`}>Admin</Link>
          )}
          <Link href="/cart" className="nav-cart-btn">
            🛒 Carrito
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="nav-user">Hola, <span>{user.nombre.split(' ')[0]}</span></Link>
              <button className="btn btn-secondary btn-sm" onClick={logout}>Salir</button>
            </>
          ) : (
            <>
              <Link href="/login" className={`nav-link ${path === '/login' ? 'active' : ''}`}>Entrar</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
