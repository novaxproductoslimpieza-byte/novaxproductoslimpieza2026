"use client";
import { useEffect, useState } from "react";
import { userApi } from "../../../lib/api";
import { generateClientsPdf, generateClientDetailPdf } from "../../../lib/pdf";
import { printClientsList, printClientDetail } from "../../../lib/print";
import ClientFilters from "./ClientFilters";
import ClientList from "./ClientList";
import ClientDetailModal from "./ClientDetailModal";

// ── Constantes ────────────────────────────────────────────────────────────────
const LOGO_URL = encodeURI("/images/config_web/logonovax.png");
const CONTACT_INFO = {
  companyName: "Novax Plus",
  phone: "(000) 000-0000",
  email: "contacto@novax.com",
  address: "La Paz, Bolivia",
};

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

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedZona, setSelectedZona] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, search, selectedProvincia, selectedZona]);

  const loadClients = async () => {
    try {
      const data = await userApi.getClients();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = clients;

    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.nombre.toLowerCase().includes(search.toLowerCase()) ||
          c.ci.includes(search) ||
          c.correo.toLowerCase().includes(search.toLowerCase()) ||
          (c.telefono && c.telefono.includes(search)),
      );
    }

    if (selectedProvincia) {
      filtered = filtered.filter(
        (c) => c.provincia?.nombre === selectedProvincia,
      );
    }

    if (selectedZona) {
      filtered = filtered.filter((c) => c.zona?.nombre === selectedZona);
    }

    setFilteredClients(filtered);
  };

  const handleViewDetail = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = async (id: number) => {
    try {
      await userApi.deleteClient(id);
      setClients(clients.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Error al eliminar el cliente");
    }
  };

  const handlePdfList = () => {
    generateClientsPdf(filteredClients, {
      logoUrl: LOGO_URL,
      contact: CONTACT_INFO,
      title: "Lista de Clientes",
      subtitle: "Clientes filtrados",
    });
  };

  const handlePrintList = () => {
    printClientsList(filteredClients, {
      logoUrl: LOGO_URL,
      contact: CONTACT_INFO,
      title: "Lista de Clientes",
      subtitle: "Clientes filtrados",
    });
  };

  const handlePdfDetail = () => {
    if (selectedClient) {
      generateClientDetailPdf(selectedClient, {
        logoUrl: LOGO_URL,
        contact: CONTACT_INFO,
        title: "Detalle de Cliente",
        subtitle: `Cliente: ${selectedClient.nombre}`,
      });
    }
  };

  const handlePrintDetail = () => {
    if (selectedClient) {
      printClientDetail(selectedClient, {
        logoUrl: LOGO_URL,
        contact: CONTACT_INFO,
        title: "Detalle de Cliente",
        subtitle: `Cliente: ${selectedClient.nombre}`,
      });
    }
  };

  const handleUpdate = () => {
    setLoading(true);
    loadClients();
  };

  const handleClear = () => {
    setSearch("");
    setSelectedProvincia("");
    setSelectedZona("");
  };

  return (
    <div className=" orders-module py-2">
      <div className="module-header d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <nav className="breadcrumb-nav mb-1">
            <span className="breadcrumb-text">Administración</span>
            <span className="text-muted mx-1">›</span>
            <span className="breadcrumb-text active">Clientes</span>
          </nav>
          <h1 className="h3 fw-bold text-dark mb-0 window-title">
            {" "}
            GESTION DE CLIENTES
          </h1>
          <p className="text-muted small mb-0 mt-1">
            {clients.length} cliente{clients.length !== 1 ? "s" : ""} encontrado
            {clients.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <ClientFilters
        search={search}
        onSearchChange={setSearch}
        selectedProvincia={selectedProvincia}
        onProvinciaChange={setSelectedProvincia}
        selectedZona={selectedZona}
        onZonaChange={setSelectedZona}
        onPdf={handlePdfList}
        onPrint={handlePrintList}
        onUpdate={handleUpdate}
        onClear={handleClear}
      />

      <ClientList
        clients={filteredClients}
        loading={loading}
        onViewDetail={handleViewDetail}
        onDelete={handleDeleteClient}
        onLocation={(client) => {
          if (client.latitud && client.longitud) {
            window.open(
              `https://www.google.com/maps?q=${client.latitud},${client.longitud}`,
              "_blank",
            );
          }
        }}
      />

      <ClientDetailModal
        client={selectedClient}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPdf={handlePdfDetail}
        onPrint={handlePrintDetail}
        onDelete={() => {
          if (selectedClient) {
            handleDeleteClient(selectedClient.id);
            handleCloseModal();
          }
        }}
      />
    </div>
  );
}
