'use client';
import { useEffect, useState } from 'react';
import { userApi } from '../../../lib/api';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { userApi.getClients().then(setClients).finally(() => setLoading(false)); }, []);

  const filtered = clients.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.correo.toLowerCase().includes(search.toLowerCase()) ||
    c.ci.includes(search)
  );

  return (
    <div className="py-2">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-0 window-title">Clientes</h1>
          <p className="text-muted small mb-0">{clients.length} clientes registrados</p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 col-lg-4">
          <div className="position-relative">
            <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted opacity-50">🔍</span>
            <input 
              className="form-control bg-light border-secondary border-opacity-10 text-dark ps-5 rounded-pill shadow-none" 
              placeholder="Buscar por nombre, CI o correo..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="window-card overflow-hidden p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th className="px-4 py-3 border-0">Nombre</th>
                <th className="py-3 border-0">CI</th>
                <th className="py-3 border-0">Correo</th>
                <th className="py-3 border-0">Teléfono</th>
                <th className="pe-4 py-3 border-0">Dirección</th>
              </tr>
            </thead>
            <tbody className="border-0">
              {loading ? (
                Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={5} className="p-3"><div className="skeleton" style={{ height: '36px' }} /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-5 text-center text-muted">No se encontraron clientes.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td className="px-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="client-avatar shadow-sm" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                        {c.nombre.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-bold text-dark">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="text-muted small">{c.ci}</td>
                  <td className="small text-dark">{c.correo}</td>
                  <td className="small text-dark">{c.telefono || <span className="opacity-25">—</span>}</td>
                  <td className="pe-4">
                    <div className="d-flex align-items-center gap-2">
                      <div className="text-muted small text-truncate" style={{ maxWidth: '150px' }} title={c.direccion || ''}>
                        {c.direccion || <span className="opacity-25">—</span>}
                      </div>
                      {c.latitud && c.longitud ? (
                        <span className="badge rounded-pill bg-primary bg-opacity-20 text-primary-dark extra-small border border-primary border-opacity-10" title={`${c.latitud}, ${c.longitud}`}>📍 Ubicado</span>
                      ) : (
                        <span className="badge rounded-pill bg-light text-muted extra-small border border-light">⚪ Sin mapa</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>{`
        .extra-small { font-size: 0.65rem; padding: 2px 8px; }
      `}</style>
    </div>
  );
}
