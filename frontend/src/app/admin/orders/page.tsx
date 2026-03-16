'use client';
import { useEffect, useState } from 'react';
import { ordersApi } from '../../../lib/api';

const ESTADOS = ['PENDIENTE', 'APROBADO', 'EN_DESPACHO', 'ENTREGADO', 'CANCELADO'];
const ESTADO_LABELS: Record<string, string> = { PENDIENTE: 'Pendiente', APROBADO: 'Aprobado', EN_DESPACHO: 'En Despacho', ENTREGADO: 'Entregado', CANCELADO: 'Cancelado' };
const BADGE_CLS: Record<string, string> = { PENDIENTE: 'badge-pending', APROBADO: 'badge-approved', EN_DESPACHO: 'badge-dispatch', ENTREGADO: 'badge-delivered', CANCELADO: 'badge-cancelled' };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  const load = () => ordersApi.getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleStatus = async (id: number, estado: string) => {
    setUpdating(id);
    try { await ordersApi.updateStatus(id, estado); await load(); }
    catch (e: any) { alert(e.message); }
    finally { setUpdating(null); }
  };

  const filtered = filterEstado ? orders.filter(o => o.estado === filterEstado) : orders;

  return (
    <div className="py-2">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-bold text-dark mb-0 window-title">Gestión de Pedidos</h1>
        </div>
      </div>

      <div className="filter-scroll-container mb-4 pb-2">
        <div className="d-flex gap-2">
          <button className={`btn rounded-pill px-4 btn-sm fw-bold ${!filterEstado ? 'btn-primary-dark text-white shadow-sm' : 'btn-light text-muted border-light'}`} onClick={() => setFilterEstado('')}>Todos</button>
          {ESTADOS.map(e => (
            <button key={e} className={`btn rounded-pill px-4 btn-sm fw-bold ${filterEstado === e ? 'btn-primary-dark text-white shadow-sm' : 'btn-light text-muted border-light'}`} onClick={() => setFilterEstado(e)}>
              {ESTADO_LABELS[e]}
            </button>
          ))}
        </div>
      </div>

      <div className="window-card overflow-hidden p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th className="px-4 py-3 border-0">#</th>
                <th className="py-3 border-0">Cliente</th>
                <th className="py-3 border-0 text-center">Ítems</th>
                <th className="py-3 border-0">Total</th>
                <th className="py-3 border-0">Estado</th>
                <th className="pe-4 py-3 border-0 text-end">Acción</th>
              </tr>
            </thead>
            <tbody className="border-0">
              {loading ? (
                Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={6} className="p-3"><div className="skeleton" style={{ height: '36px' }} /></td></tr>)
              ) : filtered.map(o => {
                const total = o.detalles?.reduce((s: number, d: any) => s + Number(d.precio) * d.cantidad, 0) || 0;
                const next: Record<string, string> = { PENDIENTE: 'APROBADO', APROBADO: 'EN_DESPACHO', EN_DESPACHO: 'ENTREGADO' };
                return (
                  <tr key={o.id}>
                    <td className="px-4 text-muted small">#{o.id}</td>
                    <td>
                      <div className="fw-bold text-dark">{o.cliente?.nombre}</div>
                      <div className="text-muted extra-small">{o.cliente?.correo}</div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border border-light fw-bold rounded-pill px-3">{o.detalles?.length}</span>
                    </td>
                    <td className="text-primary-dark fw-bold small">Bs. {total.toFixed(2)}</td>
                    <td>
                      <span className={`badge rounded-pill bg-opacity-20 py-1 px-3 small bg-${o.estado === 'PENDIENTE' ? 'warning text-warning' : o.estado === 'APROBADO' ? 'primary text-primary' : o.estado === 'ENTREGADO' ? 'success text-success' : o.estado === 'CANCELADO' ? 'danger text-danger' : 'info text-info'}`}>
                        {ESTADO_LABELS[o.estado]}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {next[o.estado] && (
                          <button className="btn btn-primary-dark btn-sm rounded-pill px-3 shadow-sm text-white fw-bold" disabled={updating === o.id} onClick={() => handleStatus(o.id, next[o.estado])}>
                            {updating === o.id ? '...' : `→ ${ESTADO_LABELS[next[o.estado]]}`}
                          </button>
                        )}
                        {o.estado !== 'ENTREGADO' && o.estado !== 'CANCELADO' && (
                          <button className="btn btn-light btn-sm rounded-circle p-2 border border-light text-danger hover-scale" disabled={updating === o.id} onClick={() => handleStatus(o.id, 'CANCELADO')} title="Cancelar">
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <style jsx>{`
        .filter-scroll-container { overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
        .filter-scroll-container::-webkit-scrollbar { display: none; }
        .extra-small { font-size: 0.7rem; }
      `}</style>
    </div>
  );
}
