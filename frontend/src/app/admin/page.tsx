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
    <div className="py-2">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h2 fw-bold text-light mb-1">Dashboard</h1>
          <p className="text-muted small">Resumen del sistema Novax ERP</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="row g-3 mb-5">
        {loading ? Array(4).fill(0).map((_, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="skeleton" style={{ height: '120px', borderRadius: '1rem' }} />
          </div>
        )) :
          statCards.map(s => (
            <div key={s.label} className="col-6 col-md-3">
              <Link href={s.link} className="card bg-dark border-secondary border-opacity-25 h-100 p-3 text-decoration-none transition-scale product-card-hover" style={{ borderRadius: '1rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="fs-3">{s.icon}</div>
                </div>
                <div>
                  <div className="h2 fw-bold mb-0" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-muted small fw-medium">{s.label}</div>
                </div>
              </Link>
            </div>
          ))
        }
      </div>

      {/* Pedidos recientes */}
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 fw-bold text-light mb-0">Últimos pedidos</h2>
            <Link href="/admin/orders" className="btn btn-outline-primary btn-sm rounded-pill px-3">Ver todos</Link>
          </div>
          
          <div className="card bg-dark border-secondary border-opacity-25 overflow-hidden" style={{ borderRadius: '1rem' }}>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead className="bg-secondary bg-opacity-10 text-muted small text-uppercase">
                  <tr>
                    <th className="px-4 py-3 border-0">#</th>
                    <th className="py-3 border-0">Cliente</th>
                    <th className="py-3 border-0">Fecha</th>
                    <th className="py-3 border-0">Estado</th>
                    <th className="pe-4 py-3 border-0 text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  {loading ? (
                    <tr><td colSpan={5} className="p-4"><div className="skeleton" style={{ height: '40px' }} /></td></tr>
                  ) : recentOrders.map(o => (
                    <tr key={o.id}>
                      <td className="px-4 text-muted">#{o.id}</td>
                      <td className="fw-bold text-light">{o.cliente?.nombre}</td>
                      <td className="text-muted small">{new Date(o.fecha).toLocaleDateString('es-BO')}</td>
                      <td>
                        <span className={`badge rounded-pill bg-opacity-10 py-1 px-2 small bg-${o.estado === 'PENDIENTE' ? 'warning text-warning' : o.estado === 'APROBADO' ? 'primary text-primary' : o.estado === 'ENTREGADO' ? 'success text-success' : 'info text-info'}`}>
                          {o.estado}
                        </span>
                      </td>
                      <td className="pe-4 text-end">
                        <Link href="/admin/orders" className="btn btn-secondary btn-sm rounded-pill px-3 border-secondary border-opacity-25">Ver</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
