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
    <div className="container py-5">
      {success && (
        <div className="alert alert-success border-0 shadow-sm rounded-pill px-4 mb-4 d-flex align-items-center" role="alert">
          <span className="fs-4 me-3">✓</span>
          <div>¡Pedido realizado exitosamente! Te avisaremos cuando sea aprobado.</div>
        </div>
      )}
      
      <div className="row mb-4">
        <div className="col">
          <h1 className="h2 fw-bold text-dark mb-1 window-title">Mis Pedidos</h1>
          <p className="text-muted small mb-0">{orders.length} pedido{orders.length !== 1 ? 's' : ''} registrado{orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5 border border-secondary border-opacity-10 rounded-4 bg-white shadow-sm">
          <div className="display-1 mb-3 opacity-25">📋</div>
          <p className="text-muted mb-4">Todavía no realizaste ningún pedido.</p>
          <Link href="/" className="btn btn-primary-dark rounded-pill px-5 fw-bold text-white">Ver catálogo</Link>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map(order => {
            const estado = ESTADO_LABELS[order.estado] || { label: order.estado, cls: 'bg-secondary' };
            const steps = ['PENDIENTE', 'APROBADO', 'EN_DESPACHO', 'ENTREGADO'];
            const currentIdx = steps.indexOf(order.estado);

            return (
              <div key={order.id} className="col-12 col-xl-10 mx-auto">
                <div className="window-card overflow-hidden p-0">
                  <div className="card-header bg-light border-bottom border-light p-3 p-md-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                      <div>
                        <div className="h5 fw-bold text-dark mb-1">Pedido #{order.id}</div>
                        <div className="text-muted small">
                          📅 {new Date(order.fecha).toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                      <span className={`badge rounded-pill px-3 py-2 ${estado.cls}`}>
                        {estado.label}
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-3 p-md-4">
                    {/* Timeline */}
                    <div className="mb-4">
                      <div className="progress bg-light rounded-pill mb-3" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar progress-bar-striped progress-bar-animated rounded-pill bg-primary-dark" 
                          role="progressbar" 
                          style={{ width: `${((currentIdx + 1) / steps.length) * 100}%` }}
                          aria-valuenow={((currentIdx + 1) / steps.length) * 100} 
                          aria-valuemin={0} 
                          aria-valuemax={100}
                        ></div>
                      </div>
                      <div className="row g-0 text-center small-text-timeline">
                        {steps.map((step, i) => {
                          const active = i <= currentIdx;
                          return (
                            <div key={step} className={`col ${active ? 'fw-bold text-primary-dark' : 'text-muted opacity-50'}`} style={{ fontSize: '0.7rem' }}>
                              <div className={`d-block d-md-none`}>{i + 1}</div>
                              <div className="d-none d-md-block text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>{ESTADO_LABELS[step]?.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Productos */}
                    <div className="bg-light rounded-3 p-3 mb-3 border border-light">
                      <h6 className="text-muted small fw-bold text-uppercase mb-3 px-1">Productos</h6>
                      <div className="d-flex flex-column gap-2">
                        {order.detalles?.map((det: any) => (
                          <div key={det.id} className="d-flex justify-content-between align-items-center small px-1 border-bottom border-light pb-2 mb-1 last-border-0">
                            <span className="text-dark fw-medium">{det.producto?.nombre} <span className="text-muted ms-2 fw-normal">×{det.cantidad}</span></span>
                            <span className="text-primary-dark fw-bold">Bs. {(Number(det.precio) * det.cantidad).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="d-flex justify-content-end align-items-center pt-2">
                      <div className="h6 mb-0 text-muted me-3 fw-bold">Total a pagar:</div>
                      <div className="h4 mb-0 text-accent fw-bold fs-3">Bs. {order.detalles?.reduce((s: number, d: any) => s + Number(d.precio) * d.cantidad, 0).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <style jsx>{`
        .small-text-timeline {
          margin-top: -5px;
        }
        @media (max-width: 576px) {
          .fs-3 { font-size: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
