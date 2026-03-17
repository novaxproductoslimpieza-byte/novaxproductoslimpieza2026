'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ordersApi } from '../../../lib/api';

// ── Tipos y Constantes ────────────────────────────────────────────────────────
const ESTADOS = ['PENDIENTE', 'APROBADO', 'EN_DESPACHO', 'ENTREGADO', 'CANCELADO'] as const;
type EstadoPedido = typeof ESTADOS[number];

const ESTADO_LABELS: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente', APROBADO: 'Aprobado', EN_DESPACHO: 'En Despacho',
  ENTREGADO: 'Entregado', CANCELADO: 'Cancelado',
};
const ESTADO_NEXT: Partial<Record<EstadoPedido, EstadoPedido>> = {
  PENDIENTE: 'APROBADO', APROBADO: 'EN_DESPACHO', EN_DESPACHO: 'ENTREGADO',
};
const BADGE_CLS: Record<EstadoPedido, string> = {
  PENDIENTE: 'badge-pending', APROBADO: 'badge-approved', EN_DESPACHO: 'badge-dispatch',
  ENTREGADO: 'badge-delivered', CANCELADO: 'badge-cancelled',
};

const PAGE_SIZE = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' });
const calcTotal = (detalles: any[]) =>
  detalles?.reduce((s: number, d: any) => s + Number(d.precio) * d.cantidad, 0) || 0;

// ── Componente StatusBadge ────────────────────────────────────────────────────
function StatusBadge({ estado }: { estado: string }) {
  const cls = BADGE_CLS[estado as EstadoPedido] ?? 'badge-default';
  return <span className={`status-badge ${cls}`}>{ESTADO_LABELS[estado as EstadoPedido] ?? estado}</span>;
}

// ── Modal de Detalle ──────────────────────────────────────────────────────────
function OrderDetailModal({
  order, onClose, onChangeStatus, updating, onDelete,
}: {
  order: any; onClose: () => void; onChangeStatus: (id: number, estado: string) => Promise<void>;
  updating: boolean; onDelete: (id: number) => Promise<void>;
}) {
  const total = calcTotal(order.detalles);
  const nextState = ESTADO_NEXT[order.estado as EstadoPedido];
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  return (
    <>
      {/* Overlay de bloqueo */}
      <div className="modal-overlay" onClick={onClose} />

      {/* Panel de detalle */}
      <div className="detail-panel" id="print-area" ref={printRef}>
        {/* Header del modal */}
        <div className="detail-header d-flex justify-content-between align-items-start mb-4 no-print-close">
          <div>
            <nav aria-label="breadcrumb" className="mb-1">
              <span className="breadcrumb-text">Administración</span>
              <span className="text-muted mx-1">›</span>
              <span className="breadcrumb-text">Pedidos</span>
              <span className="text-muted mx-1">›</span>
              <span className="text-dark fw-bold">#{order.id}</span>
            </nav>
            <h2 className="h4 fw-bold text-dark mb-0">Detalle del Pedido</h2>
          </div>
          <button className="btn btn-light btn-sm rounded-circle p-2 border-0 no-print" onClick={onClose} title="Cerrar">✕</button>
        </div>

        {/* Info general */}
        <div className="info-grid mb-4">
          <div className="info-item">
            <span className="info-label">N° Pedido</span>
            <span className="info-value fw-bold text-primary-dark">#{order.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fecha</span>
            <span className="info-value">{fmtDate(order.fecha)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Estado</span>
            <StatusBadge estado={order.estado} />
          </div>
          <div className="info-item">
            <span className="info-label">Cliente</span>
            <span className="info-value fw-bold">{order.cliente?.nombre}</span>
          </div>
          <div className="info-item">
            <span className="info-label">CI</span>
            <span className="info-value">{order.cliente?.ci}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Teléfono</span>
            <span className="info-value">{order.cliente?.telefono || '—'}</span>
          </div>
          <div className="info-item" style={{ gridColumn: '1 / -1' }}>
            <span className="info-label">Dirección</span>
            <span className="info-value">{order.cliente?.direccion || '—'}</span>
          </div>
          <div className="info-item" style={{ gridColumn: '1 / -1' }}>
            <span className="info-label">Correo</span>
            <span className="info-value">{order.cliente?.correo}</span>
          </div>
        </div>

        {/* Tabla de productos */}
        <h3 className="h6 fw-bold text-dark text-uppercase small mb-3" style={{ letterSpacing: '0.5px' }}>Productos del Pedido</h3>
        <div className="detail-table-wrap mb-4">
          <table className="detail-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th className="text-center">Presentación</th>
                <th className="text-center">Cant.</th>
                <th className="text-end">Precio Unit.</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.detalles?.map((d: any, i: number) => (
                <tr key={d.id}>
                  <td className="text-muted small">{i + 1}</td>
                  <td className="fw-bold">{d.producto?.nombre}</td>
                  <td className="text-center text-muted small">{d.producto?.presentacion || '—'}</td>
                  <td className="text-center fw-bold">{d.cantidad}</td>
                  <td className="text-end">Bs. {Number(d.precio).toFixed(2)}</td>
                  <td className="text-end fw-bold text-primary-dark">Bs. {(Number(d.precio) * d.cantidad).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="text-end fw-bold text-dark border-top border-light pt-2">Total:</td>
                <td className="text-end fw-bold text-primary-dark border-top border-light pt-2 fs-5">Bs. {total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Botonera del formulario */}
        <div className="d-flex flex-wrap gap-2 no-print">
          {nextState && (
            <button
              className="btn btn-primary-dark btn-sm rounded-pill px-4 fw-bold shadow-sm text-white"
              disabled={updating}
              onClick={() => onChangeStatus(order.id, nextState)}
            >
              {updating ? '...' : `→ ${ESTADO_LABELS[nextState]}`}
            </button>
          )}
          {order.estado !== 'ENTREGADO' && order.estado !== 'CANCELADO' && (
            <button
              className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
              disabled={updating}
              onClick={() => onChangeStatus(order.id, 'CANCELADO')}
            >
              ✕ Cancelar pedido
            </button>
          )}
          <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold border border-light ms-auto" onClick={handlePrint}>
            🖨 Imprimir
          </button>
          <button
            className="btn btn-danger btn-sm rounded-pill px-3 fw-bold"
            onClick={() => onDelete(order.id)}
            disabled={updating}
          >
            🗑 Eliminar
          </button>
          <button className="btn btn-secondary btn-sm rounded-pill px-3 fw-bold" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </>
  );
}

// ── Página Principal ──────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Modal detalle
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterDesde, setFilterDesde] = useState('');
  const [filterHasta, setFilterHasta] = useState('');

  // Paginación
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    ordersApi.getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Filtrado en memoria
  const filtered = useMemo(() => {
    let list = orders;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        String(o.id).includes(q) ||
        o.cliente?.nombre?.toLowerCase().includes(q) ||
        o.cliente?.ci?.toLowerCase().includes(q) ||
        o.cliente?.correo?.toLowerCase().includes(q)
      );
    }
    if (filterEstado) list = list.filter(o => o.estado === filterEstado);
    if (filterDesde) list = list.filter(o => new Date(o.fecha) >= new Date(filterDesde));
    if (filterHasta) list = list.filter(o => new Date(o.fecha) <= new Date(filterHasta + 'T23:59:59'));
    return list;
  }, [orders, search, filterEstado, filterDesde, filterHasta]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => { setSearch(''); setFilterEstado(''); setFilterDesde(''); setFilterHasta(''); setPage(1); };

  const handleViewDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const detail = await ordersApi.getOrderById(id);
      setSelectedOrder(detail);
    } catch (e: any) { alert(e.message); }
    finally { setLoadingDetail(false); }
  };

  const handleChangeStatus = async (id: number, estado: string) => {
    setUpdating(true);
    try {
      await ordersApi.updateStatus(id, estado);
      await load();
      // Actualizar el order en el modal si está abierto
      if (selectedOrder?.id === id) {
        const updated = await ordersApi.getOrderById(id);
        setSelectedOrder(updated);
      }
    } catch (e: any) { alert(e.message); }
    finally { setUpdating(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`¿Eliminar pedido #${id}? Esta acción no se puede deshacer.`)) return;
    setUpdating(true);
    try {
      await ordersApi.deleteOrder(id);
      setSelectedOrder(null);
      await load();
    } catch (e: any) { alert(e.message); }
    finally { setUpdating(false); }
  };

  return (
    <div className="orders-module py-2">

      {/* ── Cabecera del Módulo (AdminHeader) ── */}
      <div className="module-header d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <nav className="breadcrumb-nav mb-1">
            <span className="breadcrumb-text">Administración</span>
            <span className="text-muted mx-1">›</span>
            <span className="breadcrumb-text active">Pedidos</span>
          </nav>
          <h1 className="h3 fw-bold text-dark mb-0 window-title">Gestión de Pedidos</h1>
          <p className="text-muted small mb-0 mt-1">
            {filtered.length} pedido{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn btn-light btn-sm rounded-pill px-4 fw-bold border border-light shadow-sm" onClick={load}>
          ↺ Actualizar
        </button>
      </div>

      {/* ── Panel de Búsqueda y Filtros (SearchBar) ── */}
      <div className="window-card p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Búsqueda</label>
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ pointerEvents: 'none' }}>🔍</span>
              <input
                className="form-control form-control-sm ps-5 rounded-pill border border-light bg-light text-dark shadow-none"
                placeholder="N° pedido, cliente, CI..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Estado</label>
            <select
              className="form-select form-select-sm rounded-pill border border-light bg-light text-dark shadow-none"
              value={filterEstado}
              onChange={e => { setFilterEstado(e.target.value); setPage(1); }}
            >
              <option value="">Todos</option>
              {ESTADOS.map(e => <option key={e} value={e}>{ESTADO_LABELS[e]}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Desde</label>
            <input
              type="date" className="form-control form-control-sm rounded-pill border border-light bg-light text-dark shadow-none"
              value={filterDesde}
              onChange={e => { setFilterDesde(e.target.value); setPage(1); }}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Hasta</label>
            <input
              type="date" className="form-control form-control-sm rounded-pill border border-light bg-light text-dark shadow-none"
              value={filterHasta}
              onChange={e => { setFilterHasta(e.target.value); setPage(1); }}
            />
          </div>
          <div className="col-6 col-md-2 d-flex align-items-end">
            <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold border border-light w-100" onClick={clearFilters}>
              ✕ Limpiar
            </button>
          </div>
        </div>

        {/* Chips de estado rápido */}
        <div className="d-flex gap-2 mt-3 flex-wrap">
          <button
            className={`btn rounded-pill px-3 btn-xs fw-bold ${!filterEstado ? 'btn-primary-dark text-white shadow-sm' : 'btn-light text-muted border-light'}`}
            onClick={() => { setFilterEstado(''); setPage(1); }}
          >
            Todos ({orders.length})
          </button>
          {ESTADOS.map(e => {
            const count = orders.filter(o => o.estado === e).length;
            return (
              <button
                key={e}
                className={`btn rounded-pill px-3 btn-xs fw-bold ${filterEstado === e ? 'btn-primary-dark text-white shadow-sm' : 'btn-light text-muted border-light'}`}
                onClick={() => { setFilterEstado(e); setPage(1); }}
              >
                <span className={`dot-${e.toLowerCase().replace('_', '')}`} /> {ESTADO_LABELS[e]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tabla de Resultados (DataTable) ── */}
      <div className="window-card overflow-hidden p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th className="px-4 py-3 border-0">#</th>
                <th className="py-3 border-0">Cliente</th>
                <th className="py-3 border-0 d-none d-md-table-cell">CI</th>
                <th className="py-3 border-0 d-none d-lg-table-cell">Fecha</th>
                <th className="py-3 border-0 text-center">Ítems</th>
                <th className="py-3 border-0">Total</th>
                <th className="py-3 border-0">Estado</th>
                <th className="pe-4 py-3 border-0 text-end">Acciones</th>
              </tr>
            </thead>
            <tbody className="border-0">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="p-3"><div className="skeleton" style={{ height: '40px' }} /></td></tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted">
                    <div className="display-6 mb-2 opacity-25">📦</div>
                    <div className="small">No se encontraron pedidos</div>
                    {(search || filterEstado || filterDesde || filterHasta) && (
                      <button className="btn btn-link btn-sm text-primary-dark p-0 mt-2" onClick={clearFilters}>Limpiar filtros</button>
                    )}
                  </td>
                </tr>
              ) : (
                paginated.map(o => {
                  const total = calcTotal(o.detalles);
                  const next = ESTADO_NEXT[o.estado as EstadoPedido];
                  return (
                    <tr key={o.id} className="table-row-hover">
                      <td className="px-4 text-muted small fw-bold"># {o.id}</td>
                      <td>
                        <div className="fw-bold text-dark small">{o.cliente?.nombre}</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{o.cliente?.correo}</div>
                      </td>
                      <td className="text-muted small d-none d-md-table-cell">{o.cliente?.ci}</td>
                      <td className="text-muted small d-none d-lg-table-cell">{fmtDate(o.fecha)}</td>
                      <td className="text-center">
                        <span className="badge bg-light text-dark border border-light fw-bold rounded-pill px-2">
                          {o.detalles?.length}
                        </span>
                      </td>
                      <td className="fw-bold small text-primary-dark">Bs. {total.toFixed(2)}</td>
                      <td><StatusBadge estado={o.estado} /></td>
                      <td className="pe-4 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <button
                            className="btn btn-light btn-sm rounded-circle p-2 border border-light hover-scale"
                            onClick={() => handleViewDetail(o.id)}
                            title="Ver detalle"
                            disabled={loadingDetail}
                          >
                            👁
                          </button>
                          {next && (
                            <button
                              className="btn btn-primary-dark btn-sm rounded-pill px-2 text-white fw-bold shadow-sm"
                              style={{ fontSize: '0.7rem' }}
                              disabled={updating}
                              onClick={() => handleChangeStatus(o.id, next)}
                              title={`Avanzar a ${ESTADO_LABELS[next]}`}
                            >
                              → {ESTADO_LABELS[next]}
                            </button>
                          )}
                          {o.estado !== 'ENTREGADO' && o.estado !== 'CANCELADO' && (
                            <button
                              className="btn btn-light btn-sm rounded-circle p-2 border border-light text-danger hover-scale"
                              disabled={updating}
                              onClick={() => handleChangeStatus(o.id, 'CANCELADO')}
                              title="Cancelar"
                            >✕</button>
                          )}
                          <button
                            className="btn btn-light btn-sm rounded-circle p-2 border border-light text-danger hover-scale"
                            disabled={updating}
                            onClick={() => handleDelete(o.id)}
                            title="Eliminar"
                          >🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Paginación ── */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top border-light bg-light">
            <span className="text-muted small">
              Página {page} de {totalPages} · {filtered.length} registros
            </span>
            <div className="d-flex gap-1">
              <button className="btn btn-light btn-sm rounded-pill px-3 border-light" onClick={() => setPage(1)} disabled={page === 1}>«</button>
              <button className="btn btn-light btn-sm rounded-pill px-3 border-light" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.min(Math.max(page - 2, 1) + i, totalPages - Math.min(4, totalPages - 1) + i);
                return (
                  <button
                    key={p}
                    className={`btn btn-sm rounded-pill px-3 ${page === p ? 'btn-primary-dark text-white' : 'btn-light border-light'}`}
                    onClick={() => setPage(p)}
                  >{p}</button>
                );
              })}
              <button className="btn btn-light btn-sm rounded-pill px-3 border-light" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
              <button className="btn btn-light btn-sm rounded-pill px-3 border-light" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal de Detalle ── */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onChangeStatus={handleChangeStatus}
          updating={updating}
          onDelete={handleDelete}
        />
      )}

      {/* ── Estilos ── */}
      <style jsx>{`
        /* StatusBadge */
        .status-badge {
          display: inline-flex; align-items: center;
          padding: 4px 12px; border-radius: 999px;
          font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.3px;
        }
        .badge-pending  { background: #fef9c3; color: #a16207; }
        .badge-approved { background: #dbeafe; color: #1d4ed8; }
        .badge-dispatch { background: #ede9fe; color: #7c3aed; }
        .badge-delivered{ background: #dcfce7; color: #166534; }
        .badge-cancelled{ background: #fee2e2; color: #dc2626; }
        .badge-default  { background: #f1f5f9; color: #64748b; }

        /* Chips - dots de color */
        .dot-pendiente::before, .dot-aprobado::before, .dot-en_despacho::before,
        .dot-entregado::before, .dot-cancelado::before {
          content: '●'; margin-right: 4px; font-size: 0.6rem;
        }
        .dot-pendiente::before  { color: #a16207; }
        .dot-aprobado::before   { color: #1d4ed8; }
        .dot-en_despacho::before{ color: #7c3aed; }
        .dot-entregado::before  { color: #166534; }
        .dot-cancelado::before  { color: #dc2626; }

        /* Breadcrumb */
        .breadcrumb-nav { display: flex; align-items: center; gap: 2px; }
        .breadcrumb-text { font-size: 0.8rem; font-weight: 600; color: #94a3b8; }
        .breadcrumb-text.active { color: #1e293b; }

        /* Botón xs */
        .btn-xs { font-size: 0.75rem; padding: 4px 12px; }

        /* Tabla hover */
        .table-row-hover:hover { background-color: #f8fafc; }

        /* Modal overlay */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(2px);
          z-index: 2000;
          animation: fadeIn 0.2s ease;
        }

        /* Panel de detalle */
        .detail-panel {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(90vw, 720px);
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 1.25rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          z-index: 2001;
          padding: 2rem;
          animation: slideUp 0.25s cubic-bezier(0.4,0,0.2,1);
        }

        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translate(-50%,-48%) } to { opacity:1; transform:translate(-50%,-50%) } }

        /* Info grid para datos del pedido */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          background: #f8fafc;
          border-radius: 1rem;
          padding: 1rem 1.25rem;
        }
        .info-item { display: flex; flex-direction: column; gap: 2px; }
        .info-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; }
        .info-value { font-size: 0.875rem; color: #1e293b; }

        /* Tabla del detalle */
        .detail-table-wrap { overflow-x: auto; border-radius: 0.75rem; border: 1px solid #e2e8f0; }
        .detail-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .detail-table th { background: #f8fafc; padding: 10px 14px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.4px; color: #64748b; font-weight: 700; border-bottom: 1px solid #e2e8f0; }
        .detail-table td { padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
        .detail-table tbody tr:last-child td { border-bottom: none; }
        .detail-table tfoot td { background: #fafafa; }

        /* Impresión */
        @media print {
          .no-print, .no-print-close button { display: none !important; }
          .modal-overlay { display: none !important; }
          .detail-panel {
            position: static !important;
            transform: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-height: none !important;
            border-radius: 0 !important;
            padding: 1rem !important;
          }
          body > *:not(#print-area):not(:has(#print-area)) { display: none !important; }
        }
      `}</style>
    </div>
  );
}
