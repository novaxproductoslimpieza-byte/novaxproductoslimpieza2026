'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { geoApi } from '../../../lib/api';

// Mapa administrativo cargado dinámicamente
const AdminMap = dynamic<any>(() => import('../../../components/AdminMap'), {
  ssr: false,
  loading: () => <div className="bg-dark bg-opacity-50 rounded-4 d-flex align-items-center justify-content-center min-vh-50" style={{ height: '600px' }}>
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status"></div>
      <p className="text-muted">Cargando mapa de geoubicación...</p>
    </div>
  </div>
});

export default function AdminGeoPage() {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zones, setZones] = useState<any[]>([]);

  // Filter states
  const [search, setSearch] = useState('');
  const [selZone, setSelZone] = useState('');
  const [selStatus, setSelStatus] = useState('');

  useEffect(() => {
    fetchData();
    // Fetch zones for filtering (assuming we use Cochabamba Cercado zones as default for filter)
    geoApi.getZonas(1).then(setZones).catch(console.error);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await geoApi.getAdminMap();
      setData(res);
      setFilteredData(res);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos de geoubicación.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [search, selZone, selStatus, data]);

  const applyFilters = () => {
    let filtered = [...data];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.nombre.toLowerCase().includes(s) ||
        (c.ci && c.ci.toString().includes(s))
      );
    }

    if (selZone) {
      filtered = filtered.filter(c => c.zona === selZone);
    }

    if (selStatus) {
      filtered = filtered.filter(c => c.prioridad === selStatus);
    }

    setFilteredData(filtered);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1 window-title">Geoubicación de Clientes</h1>
          <p className="text-muted small mb-0">Visualización en tiempo real de la ubicación de tus clientes y prioridad de pedidos.</p>
        </div>
        <button onClick={fetchData} className="btn btn-primary-dark btn-sm rounded-pill px-4 py-2 fw-bold text-dark shadow-sm transition-scale" disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : '🔄 Actualizar Mapa'}
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="position-relative">
            <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted opacity-50">🔍</span>
            <input
              type="text"
              className="form-control bg-light border-secondary border-opacity-10 text-dark rounded-pill ps-5 shadow-none"
              placeholder="Buscar por nombre o CI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select bg-light border-secondary border-opacity-10 text-dark rounded-pill px-4 shadow-none"
            value={selZone}
            onChange={(e) => setSelZone(e.target.value)}
          >
            <option value="">Todas las Zonas</option>
            {zones.map(z => <option key={z.id} value={z.nombre}>{z.nombre}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select bg-light border-secondary border-opacity-10 text-dark rounded-pill px-4 shadow-none"
            value={selStatus}
            onChange={(e) => setSelStatus(e.target.value)}
          >
            <option value="">Todos los Estados</option>
            <option value="Pedido">Pedido</option>
            <option value="Entregado">Entregado</option>
            <option value="Stand By">Stand By</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger border-0 rounded-4 shadow-sm mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="window-card p-4 h-100">
            <h6 className="text-primary-dark small fw-bold text-uppercase mb-4" style={{ letterSpacing: '1px' }}>Leyenda</h6>
            <div className="small d-flex flex-column gap-3">
              <div className="d-flex align-items-center">
                <div className="bg-danger rounded-circle me-3 shadow-sm" style={{ width: '14px', height: '14px' }}></div>
                <span className="text-dark fw-medium">Pedido Pendiente</span>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-success rounded-circle me-3 shadow-sm" style={{ width: '14px', height: '14px' }}></div>
                <span className="text-dark fw-medium">Pedido Entregado</span>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-secondary rounded-circle me-3 shadow-sm" style={{ width: '14px', height: '14px' }}></div>
                <span className="text-dark fw-medium">Stand By (Sin actividad)</span>
              </div>
            </div>

            <div className="mt-5 p-3 bg-light rounded-3 border border-light">
              <p className="text-muted extra-small mb-0">
                💡 Los marcadores muestran la ubicación exacta registrada por cada cliente.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="window-card p-0 overflow-hidden shadow-lg border-0" style={{ height: '600px' }}>
            <AdminMap clients={filteredData} />
          </div>
        </div>
      </div>
    </div>
  );
}
