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
    <div>
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <p className="page-subtitle">{clients.length} clientes registrados</p>
      </div>
      <div className="filters-bar">
        <div className="search-input-wrap" style={{ maxWidth: '320px' }}>
          <span className="search-icon">🔍</span>
          <input className="form-input search-input" placeholder="Buscar por nombre, CI o correo..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>CI</th><th>Correo</th><th>Teléfono</th><th>Dirección</th></tr></thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={5}><div className="skeleton" style={{ height: '36px' }} /></td></tr>)
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No se encontraron clientes.</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {c.nombre.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600 }}>{c.nombre}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{c.ci}</td>
                <td>{c.correo}</td>
                <td>{c.telefono || '—'}</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{c.direccion || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
