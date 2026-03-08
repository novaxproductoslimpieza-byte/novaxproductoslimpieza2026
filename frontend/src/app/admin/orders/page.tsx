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
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestión de Pedidos</h1>
      </div>
      <div className="filters-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="filter-chips">
          <button className={`chip ${!filterEstado ? 'active' : ''}`} onClick={() => setFilterEstado('')}>Todos</button>
          {ESTADOS.map(e => <button key={e} className={`chip ${filterEstado === e ? 'active' : ''}`} onClick={() => setFilterEstado(e)}>{ESTADO_LABELS[e]}</button>)}
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Cliente</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Estado</th><th>Acción</th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={7}><div className="skeleton" style={{ height: '36px' }} /></td></tr>)
            ) : filtered.map(o => {
              const total = o.detalles?.reduce((s: number, d: any) => s + Number(d.precio) * d.cantidad, 0) || 0;
              const next: Record<string, string> = { PENDIENTE: 'APROBADO', APROBADO: 'EN_DESPACHO', EN_DESPACHO: 'ENTREGADO' };
              return (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.cliente?.nombre}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.cliente?.correo}</div>
                  </td>
                  <td>{new Date(o.fecha).toLocaleDateString('es-BO')}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{o.detalles?.length} ítem(s)</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent)' }}>Bs. {total.toFixed(2)}</td>
                  <td><span className={`badge ${BADGE_CLS[o.estado] || ''}`}>{ESTADO_LABELS[o.estado]}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {next[o.estado] && (
                        <button className="btn btn-primary btn-sm" disabled={updating === o.id} onClick={() => handleStatus(o.id, next[o.estado])}>
                          → {ESTADO_LABELS[next[o.estado]]}
                        </button>
                      )}
                      {o.estado !== 'ENTREGADO' && o.estado !== 'CANCELADO' && (
                        <button className="btn btn-danger btn-sm" disabled={updating === o.id} onClick={() => handleStatus(o.id, 'CANCELADO')}>✕</button>
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
  );
}
