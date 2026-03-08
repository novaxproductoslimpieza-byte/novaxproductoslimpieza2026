'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const adminLinks = [
  { href: '/admin', label: '📊 Dashboard' },
  { href: '/admin/orders', label: '📦 Pedidos' },
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
    <div className="page container">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title">Panel Admin</div>
          {adminLinks.map(link => (
            <Link key={link.href} href={link.href} className={`admin-nav-link ${path === link.href ? 'active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </aside>
        <div className="admin-main">{children}</div>
      </div>
    </div>
  );
}
