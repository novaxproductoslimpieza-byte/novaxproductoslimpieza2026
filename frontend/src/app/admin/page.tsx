'use client';
import { useEffect, useState } from 'react';
import { catalogApi, ordersApi, userApi } from '../../lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, clients: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([catalogApi.getProducts(), ordersApi.getOrders(), userApi.getClients()])
      .then(([products, orders, clients]) => {
        setStats({ products: products.length, orders: orders.length, clients: clients.length, pendingOrders: orders.filter((o: any) => o.estado === 'PENDIENTE').length });
        setRecentOrders(orders.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Productos', value: stats.products, icon: '🧴', color: 'var(--primary)', link: '/admin/products' },
    { label: 'Pedidos totales', value: stats.orders, icon: '📦', color: 'var(--accent)', link: '/admin/orders' },
    { label: 'Pendientes', value: stats.pendingOrders, icon: '⏳', color: 'var(--warning)', link: '/admin/orders' },
    { label: 'Clientes', value: stats.clients, icon: '👥', color: '#a855f7', link: '/admin/clients' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen del sistema Novax ERP</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '12px' }} />) :
          statCards.map(s => (
            <Link href={s.link} key={s.label} className="card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </Link>
          ))
        }
      </div>

      {/* Pedidos recientes */}
      <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Últimos pedidos</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5}><div className="skeleton" style={{ height: '40px' }} /></td></tr>
            ) : recentOrders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.cliente?.nombre}</td>
                <td>{new Date(o.fecha).toLocaleDateString('es-BO')}</td>
                <td><span className={`badge badge-${o.estado.toLowerCase().replace('_', '-')}`}>{o.estado}</span></td>
                <td><Link href="/admin/orders" className="btn btn-secondary btn-sm">Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
