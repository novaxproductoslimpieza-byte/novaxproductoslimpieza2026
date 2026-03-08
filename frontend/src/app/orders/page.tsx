'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ordersApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ESTADO_LABELS: Record<string, { label: string; cls: string }> = {
  PENDIENTE: { label: 'Pendiente', cls: 'badge-pending' },
  APROBADO: { label: 'Aprobado', cls: 'badge-approved' },
  EN_DESPACHO: { label: 'En Despacho', cls: 'badge-dispatch' },
  ENTREGADO: { label: 'Entregado', cls: 'badge-delivered' },
  CANCELADO: { label: 'Cancelado', cls: 'badge-cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const success = params.get('success');

  useEffect(() => {
    if (!isLoading && !user) { router.push('/login'); return; }
    if (user) {
      ordersApi.getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false));
    }
  }, [user, isLoading]);

  if (loading || isLoading) return <div className="page container"><div className="skeleton" style={{ height: '300px', borderRadius: '12px' }} /></div>;

  return (
    <div className="page container">
      {success && <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>✓ ¡Pedido realizado exitosamente! Te avisaremos cuando sea aprobado.</div>}
      <div className="page-header">
        <h1 className="page-title">Mis Pedidos</h1>
        <p className="page-subtitle">{orders.length} pedido{orders.length !== 1 ? 's' : ''} registrado{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p style={{ marginBottom: '1rem' }}>Todavía no realizaste ningún pedido.</p>
          <Link href="/" className="btn btn-primary">Ver catálogo</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => {
            const estado = ESTADO_LABELS[order.estado] || { label: order.estado, cls: 'badge-pending' };
            return (
              <div key={order.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>Pedido #{order.id}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(order.fecha).toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <span className={`badge ${estado.cls}`}>{estado.label}</span>
                </div>

                {/* Timeline */}
                <div style={{ display: 'flex', gap: '0', marginBottom: '1rem', background: 'var(--bg-card2)', borderRadius: '8px', overflow: 'hidden' }}>
                  {['PENDIENTE', 'APROBADO', 'EN_DESPACHO', 'ENTREGADO'].map((step, i) => {
                    const steps = ['PENDIENTE', 'APROBADO', 'EN_DESPACHO', 'ENTREGADO'];
                    const currentIdx = steps.indexOf(order.estado);
                    const active = i <= currentIdx;
                    return (
                      <div key={step} style={{ flex: 1, padding: '0.5rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: active ? '#fff' : 'var(--text-muted)', background: active ? 'var(--primary)' : 'transparent', transition: '0.2s' }}>
                        {ESTADO_LABELS[step]?.label}
                      </div>
                    );
                  })}
                </div>

                {/* Productos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {order.detalles?.map((det: any) => (
                    <div key={det.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-light)' }}>
                      <span>{det.producto?.nombre} × {det.cantidad}</span>
                      <span>Bs. {(Number(det.precio) * det.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <hr className="divider" />
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: 700 }}>
                  Total: <span style={{ color: 'var(--accent)', marginLeft: '0.5rem' }}>Bs. {order.detalles?.reduce((s: number, d: any) => s + Number(d.precio) * d.cantidad, 0).toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
