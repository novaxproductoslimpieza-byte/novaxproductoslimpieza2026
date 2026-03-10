'use client';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

// Definir Iconos personalizados
const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

const iconPedido = createIcon('var(--bs-danger)');
const iconEntregado = createIcon('var(--bs-success)');
const iconStandBy = createIcon('var(--bs-secondary)');

interface ClientLocation {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  latitud: number;
  longitud: number;
  zona: string;
  prioridad: 'Pedido' | 'Entregado' | 'Stand By';
  ultimoEstado: string;
}

export default function AdminMap({ clients }: { clients: ClientLocation[] }) {
  const [center, setCenter] = useState<[number, number]>([-17.38, -66.16]);

  useEffect(() => {
    // Intentar obtener ubicación del usuario para centrar el mapa
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('No se pudo obtener la ubicación actual:', err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {clients.map(client => (
          <Marker 
            key={client.id} 
            position={[client.latitud, client.longitud]}
            icon={client.prioridad === 'Pedido' ? iconPedido : client.prioridad === 'Entregado' ? iconEntregado : iconStandBy}
          >
            <Tooltip permanent direction="top" offset={[0, -25]} className="custom-tooltip">
              <span className="fw-bold">{client.nombre}</span>
            </Tooltip>
            <Popup className="custom-popup">
              <div className="p-1">
                <h6 className="fw-bold mb-1 text-dark">{client.nombre}</h6>
                <p className="extra-small text-muted mb-2">
                  <span className="badge bg-secondary me-1">{client.zona}</span>
                  <span className={`badge ${client.prioridad === 'Pedido' ? 'bg-danger' : client.prioridad === 'Entregado' ? 'bg-success' : 'bg-secondary'}`}>
                    {client.prioridad}
                  </span>
                </p>
                <div className="small mb-3 text-dark">
                  <div className="mb-1">📞 {client.telefono || 'Sin teléfono'}</div>
                  <div className="text-truncate" style={{ maxWidth: '200px' }}>📍 {client.direccion}</div>
                </div>
                
                <div className="d-grid gap-2">
                  <Link href={`/admin/clients`} className="btn btn-primary btn-sm rounded-pill py-1 extra-small shadow-sm">
                    Ver detalle
                  </Link>
                  {client.telefono && (
                    <a 
                      href={`https://wa.me/${client.telefono.replace(/\D/g,'')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-success btn-sm rounded-pill py-1 extra-small shadow-sm d-flex align-items-center justify-content-center"
                    >
                      <span className="me-1">💬</span> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <style jsx global>{`
        .custom-tooltip {
          background-color: var(--bs-dark) !important;
          border-color: var(--bs-secondary) !important;
          color: white !important;
          font-size: 0.7rem !important;
          border-radius: 4px !important;
          padding: 2px 6px !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5) !important;
        }
        .extra-small { font-size: 0.7rem; }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 1rem;
          padding: 5px;
        }
      `}</style>
    </div>
  );
}
