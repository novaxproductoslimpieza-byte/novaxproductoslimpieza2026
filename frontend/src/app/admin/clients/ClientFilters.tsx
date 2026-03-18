import { useState, useEffect } from 'react';
import { geoApi } from '../../../lib/api';

interface ClientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedProvincia: string;
  onProvinciaChange: (value: string) => void;
  selectedZona: string;
  onZonaChange: (value: string) => void;
  onPdf: () => void;
  onPrint: () => void;
  onUpdate: () => void;
  onClear: () => void;
}

export default function ClientFilters({
  search,
  onSearchChange,
  selectedProvincia,
  onProvinciaChange,
  selectedZona,
  onZonaChange,
  onPdf,
  onPrint,
  onUpdate,
  onClear,
}: ClientFiltersProps) {
  const [provincias, setProvincias] = useState<any[]>([]);
  const [zonas, setZonas] = useState<any[]>([]);

  useEffect(() => {
    geoApi.getDepartamentos().then((deps) => {
      // Assuming first departamento for simplicity, or fetch all
      if (deps.length > 0) {
        geoApi.getProvincias(deps[0].id).then(setProvincias);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedProvincia) {
      const prov = provincias.find(p => p.nombre === selectedProvincia);
      if (prov) {
        geoApi.getZonas(prov.id).then(setZonas);
      }
    } else {
      setZonas([]);
    }
  }, [selectedProvincia, provincias]);

  return (
    <div className="row mb-4">
      <div className="col-md-6 col-lg-3 mb-3">
        <label className="form-label small fw-bold">Buscar</label>
        <div className="position-relative">
          <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted opacity-50">🔍</span>
          <input
            className="form-control bg-light border-secondary border-opacity-10 text-dark ps-5 rounded-pill shadow-none"
            placeholder="Nombre, CI, correo..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="col-md-6 col-lg-3 mb-3">
        <label className="form-label small fw-bold">Provincia</label>
        <select
          className="form-select bg-light border-secondary border-opacity-10 text-dark rounded-pill shadow-none"
          value={selectedProvincia}
          onChange={(e) => onProvinciaChange(e.target.value)}
        >
          <option value="">Todas</option>
          {provincias.map((p) => (
            <option key={p.id} value={p.nombre}>{p.nombre}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6 col-lg-3 mb-3">
        <label className="form-label small fw-bold">Zona</label>
        <select
          className="form-select bg-light border-secondary border-opacity-10 text-dark rounded-pill shadow-none"
          value={selectedZona}
          onChange={(e) => onZonaChange(e.target.value)}
          disabled={!selectedProvincia}
        >
          <option value="">Todas</option>
          {zonas.map((z) => (
            <option key={z.id} value={z.nombre}>{z.nombre}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6 col-lg-3 mb-3 d-flex align-items-end gap-2">
        <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={onPdf}>
          PDF
        </button>
        <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={onPrint}>
          Imprimir
        </button>
        <button className="btn btn-primary btn-sm rounded-pill" onClick={onUpdate}>
          Actualizar
        </button>
        <button className="btn btn-light btn-sm rounded-pill border" onClick={onClear}>
          Limpiar
        </button>
      </div>
    </div>
  );
}