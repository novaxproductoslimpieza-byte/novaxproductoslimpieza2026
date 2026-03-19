import { FaEye, FaTrash, FaMapMarkerAlt } from "react-icons/fa";

interface Client {
  id: number;
  nombre: string;
  ci: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  provincia?: { id: number; nombre: string } | null;
  zona?: { id: number; nombre: string } | null;
  latitud?: number;
  longitud?: number;
}

interface ClientListProps {
  clients: Client[];
  loading: boolean;
  onViewDetail: (client: Client) => void;
  onDelete: (id: number) => void;
  onLocation: (client: Client) => void;
}

export default function ClientList({
  clients,
  loading,
  onViewDetail,
  onDelete,
  onLocation,
}: ClientListProps) {
  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar este cliente?")) {
      onDelete(id);
    }
  };

  const handleLocation = (client: Client) => {
    if (client.latitud && client.longitud) {
      window.open(
        `https://www.google.com/maps?q=${client.latitud},${client.longitud}`,
        "_blank",
      );
    } else {
      alert("No hay ubicación disponible para este cliente.");
    }
  };

  return (
    <div className="window-card overflow-hidden p-0">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="thead-professional">
            <tr>
              <th className="px-4 py-3 border-0">Nombre</th>
              <th className="py-3 border-0">Provincia</th>
              <th className="py-3 border-0">Zona</th>
              <th className="py-3 border-0">Teléfono</th>
              <th className="pe-4 py-3 border-0">Acción</th>
            </tr>
          </thead>
          <tbody className="border-0">
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="p-3">
                      <div className="skeleton" style={{ height: "36px" }} />
                    </td>
                  </tr>
                ))
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-5 text-center text-muted">
                  No se encontraron clientes.
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id}>
                  <td className="px-4">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="client-avatar shadow-sm"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, var(--primary-dark), var(--primary))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {c.nombre.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-bold text-dark">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="text-muted small">
                    {c.provincia?.nombre ?? "—"}
                  </td>
                  <td className="text-muted small">{c.zona?.nombre ?? "—"}</td>
                  <td className="small text-dark">
                    {c.telefono ?? <span className="opacity-25">—</span>}
                  </td>
                  <td className="pe-4">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onViewDetail(c)}
                        title="Ver detalle"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(c.id)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => handleLocation(c)}
                        title="Ver ubicación"
                      >
                        <FaMapMarkerAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
