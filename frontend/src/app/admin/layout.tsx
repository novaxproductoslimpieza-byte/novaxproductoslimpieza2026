'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const adminLinks = [
  { href: '/admin', label: '📊 Dashboard' },
  { href: '/admin/orders', label: '📦 Pedidos' },
  { href: '/admin/geoubicacion', label: '📍 Geoubicación' },
  { href: '/admin/products', label: '🧴 Productos' },
  { href: '/admin/categories', label: '🏷️ Categorías' },
  { href: '/admin/clients', label: '👥 Clientes' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) router.push('/');
  }, [user, isAdmin, isLoading]);

  if (isLoading) return <div className="page container"><div className="skeleton" style={{ height: '400px', borderRadius: '12px' }} /></div>;
  if (!isAdmin) return null;

  return (
    <div className="container py-4">
      <div className="row g-4 admin-layout">
        <aside className="col-lg-3 col-xl-2">
          <div className="window-card h-100 p-3" style={{ borderRadius: '1rem' }}>
            <div className="d-flex d-lg-block justify-content-between align-items-center mb-lg-4 px-2">
              <div className="h6 fw-bold text-dark text-uppercase small letter-spacing-1 mb-0 mb-lg-3">Panel Admin</div>
              <button className="btn btn-light btn-sm d-lg-none border-secondary border-opacity-25" type="button" data-bs-toggle="collapse" data-bs-target="#adminMenu">
                ☰
              </button>
            </div>
            
            <div className="collapse d-lg-block" id="adminMenu">
              <nav className="nav flex-column gap-1">
                {adminLinks.map(link => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={`nav-link rounded-3 py-2 px-3 fw-bold transition-all small ${path === link.href ? 'bg-primary-dark text-white shadow-sm' : 'text-dark hover-bg-light opacity-75'}`}
                  >
                    <span className="me-2">{link.label.split(' ')[0]}</span>
                    {link.label.split(' ').slice(1).join(' ')}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>
        
        <main className="col-lg-9 col-xl-10">
          <div className="admin-main">
            {children}
          </div>
        </main>
      </div>

      <style jsx>{`
        .hover-bg-card2:hover {
          background-color: var(--bg-card2);
          opacity: 1 !important;
        }
        .letter-spacing-1 { letter-spacing: 1px; }
        .transition-all { transition: all 0.2s ease; }
      `}</style>
    </div>
  );
}
