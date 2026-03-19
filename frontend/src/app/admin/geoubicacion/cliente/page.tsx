"use client";
import { useEffect, useState } from "react";
import { userApi, geoApi } from "../../../../lib/api";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

interface Client {
  id: string;
  nombre: string;
  ci: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  estado: "ACTIVO" | "INACTIVO";
  zona?: { id: string; nombre: string };
  provincia?: { id: string; nombre: string };
  departamento?: { id: string; nombre: string };
}

export default function AdminClientsGeoPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editData, setEditData] = useState<Partial<Client>>({});

  useEffect(() => {
    userApi
      .getClients()
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.ci.includes(search) ||
      c.telefono?.includes(search),
  );

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setEditData(client);
  };

  const handleChange = (field: keyof Client, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selectedClient) return;

    if (
      !editData.nombre ||
      !editData.ci ||
      !editData.telefono ||
      editData.latitud === undefined ||
      editData.longitud === undefined
    ) {
      alert("Complete todos los campos obligatorios");
      return;
    }

    if (
      editData.latitud! < -90 ||
      editData.latitud! > 90 ||
      editData.longitud! < -180 ||
      editData.longitud! > 180
    ) {
      alert("Coordenadas inválidas");
      return;
    }

    try {
      await userApi.updateProfile(editData);
      alert("Cliente actualizado correctamente");
      setClients(
        clients.map((c) =>
          c.id === selectedClient.id ? ({ ...c, ...editData } as Client) : c,
        ),
      );
      setSelectedClient(null);
    } catch (err) {
      console.error(err);
      alert("Error actualizando cliente");
    }
  };

  const handleCancel = () => {
    setSelectedClient(null);
  };

  return (
    <div className="py-2 d-flex flex-column flex-lg-row gap-4">
      {/* Lista de Clientes */}
      <div className="flex-fill">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-0">Clientes</h1>
            <p className="text-muted small mb-0">
              {clients.length} clientes registrados
            </p>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="position-relative">
              <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted opacity-50">
                🔍
              </span>
              <input
                className="form-control bg-light border-secondary border-opacity-10 text-dark ps-5 rounded-pill shadow-none"
                placeholder="Buscar por CI, nombre o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="window-card overflow-hidden p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="thead-professional">
                <tr>
                  <th className="px-4 py-3 border-0">Nombre</th>
                  <th className="py-3 border-0">CI</th>
                  <th className="py-3 border-0">Teléfono</th>
                  <th className="pe-4 py-3 border-0">Ubicación</th>
                </tr>
              </thead>
              <tbody className="border-0">
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={4} className="p-3">
                          <div
                            className="skeleton"
                            style={{ height: "36px" }}
                          />
                        </td>
                      </tr>
                    ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-5 text-center text-muted">
                      No se encontraron clientes.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => handleSelectClient(c)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="px-4 fw-bold">{c.nombre}</td>
                      <td>{c.ci}</td>
                      <td>{c.telefono || "—"}</td>
                      <td>
                        {c.latitud && c.longitud ? (
                          <span className="badge rounded-pill bg-primary bg-opacity-20 text-primary-dark extra-small border border-primary border-opacity-10">
                            📍 Ubicado
                          </span>
                        ) : (
                          <span className="badge rounded-pill bg-light text-muted extra-small border border-light">
                            ⚪ Sin mapa
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Panel Lateral de Edición */}
      {selectedClient && (
        <div
          className="flex-fill border rounded p-3 shadow-sm"
          style={{ minWidth: "360px" }}
        >
          <h4 className="fw-bold mb-3">Editar Cliente</h4>
          <div className="mb-2">
            <label className="form-label small">Nombre</label>
            <input
              className="form-control"
              value={editData.nombre || ""}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label small">CI</label>
            <input
              className="form-control"
              value={editData.ci || ""}
              onChange={(e) => handleChange("ci", e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label small">Teléfono</label>
            <input
              className="form-control"
              value={editData.telefono || ""}
              onChange={(e) => handleChange("telefono", e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label small">Dirección</label>
            <input
              className="form-control"
              value={editData.direccion || ""}
              onChange={(e) => handleChange("direccion", e.target.value)}
            />
          </div>

          {/* Mapa interactivo */}
          {editData.latitud !== undefined &&
            editData.longitud !== undefined && (
              <MapContainer
                center={[editData.latitud, editData.longitud]}
                zoom={15}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[editData.latitud, editData.longitud]}
                  draggable
                  eventHandlers={{
                    dragend: (e: any) => {
                      const marker = e.target;
                      const position = marker.getLatLng();
                      handleChange("latitud", position.lat);
                      handleChange("longitud", position.lng);
                    },
                  }}
                />
              </MapContainer>
            )}

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-primary flex-fill" onClick={handleSave}>
              Guardar
            </button>
            <button
              className="btn btn-secondary flex-fill"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .extra-small {
          font-size: 0.65rem;
          padding: 2px 8px;
        }
      `}</style>
    </div>
  );
}
