import { FaTimes } from 'react-icons/fa';

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
  observaciones?: string;
}

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onPdf: () => void;
  onPrint: () => void;
  onDelete: () => void;
}

export default function ClientDetailModal({
  client,
  isOpen,
  onClose,
  onPdf,
  onPrint,
  onDelete,
}: ClientDetailModalProps) {
  if (!isOpen || !client) return null;

  const handleDelete = () => {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      onDelete();
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalle de Cliente</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Información Personal</h6>
                <p><strong>Nombre:</strong> {client.nombre}</p>
                <p><strong>CI:</strong> {client.ci}</p>
                <p><strong>Correo:</strong> {client.correo}</p>
                <p><strong>Teléfono:</strong> {client.telefono ?? '—'}</p>
                <p><strong>Dirección:</strong> {client.direccion ?? '—'}</p>
              </div>
              <div className="col-md-6">
                <h6>Ubicación</h6>
                <p><strong>Provincia:</strong> {client.provincia?.nombre ?? '—'}</p>
                <p><strong>Zona:</strong> {client.zona?.nombre ?? '—'}</p>
                {client.latitud && client.longitud && (
                  <p><strong>Coordenadas:</strong> {client.latitud}, {client.longitud}</p>
                )}
                {client.observaciones && (
                  <div>
                    <h6>Observaciones</h6>
                    <p>{client.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-primary" onClick={onPdf}>
              PDF
            </button>
            <button className="btn btn-outline-secondary" onClick={onPrint}>
              Imprimir
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Eliminar
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}