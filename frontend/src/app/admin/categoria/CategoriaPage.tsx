"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Categoria, categoriaApi } from "./categoriaApi";
import { printCategoriasList } from "@/lib/print";
import { generateCategoriasPdf } from "@/lib/pdf";
import CategoriaDialog from "./CategoriaDialog";

const LOGO_URL = encodeURI("/images/config_web/logonovax.png");
const PAGE_SIZE = 8;

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("es-BO", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

export default function CategoriaPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [open, setOpen] = useState(false);

    const [page, setPage] = useState(1);

    // Filtros
    const [search, setSearch] = useState("");
    const [filterDesde, setFilterDesde] = useState("");
    const [filterHasta, setFilterHasta] = useState("");

    const load = useCallback(() => {
        setLoading(true);
        categoriaApi
            .getCategorias()
            .then(setCategorias)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    // Filtrado
    const filtered = useMemo(() => {
        let list = categorias;
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (c) =>
                    c.nombre?.toLowerCase().includes(q) ||
                    c.descripcion?.toLowerCase().includes(q) ||
                    String(c.id).includes(q)
            );
        }
        if (filterDesde)
            list = list.filter((c) => new Date(c.createdAt) >= new Date(filterDesde));
        if (filterHasta)
            list = list.filter(
                (c) => new Date(c.createdAt) <= new Date(filterHasta + "T23:59:59")
            );
        return list;
    }, [categorias, search, filterDesde, filterHasta]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const clearFilters = () => {
        setSearch("");
        setFilterDesde("");
        setFilterHasta("");
        setPage(1);
    };

    // Acciones CRUD
    const handleSave = async () => {
        if (selectedCategoria?.id) {
            await categoriaApi.updateCategoria(selectedCategoria.id, {
                nombre: selectedCategoria.nombre,
                descripcion: selectedCategoria.descripcion,
            });
        } else if (selectedCategoria) {
            await categoriaApi.createCategoria({
                nombre: selectedCategoria.nombre,
                descripcion: selectedCategoria.descripcion,
            });
        }
        setOpen(false);
        setSelectedCategoria(null);
        load();
    };

    const handleDelete = async (id: number) => {
        if (!confirm(`¿Eliminar categoría #${id}? Esta acción no se puede deshacer.`)) return;
        await categoriaApi.deleteCategoria(id);
        setOpen(false);
        setSelectedCategoria(null);
        load();
    };

    // Print / PDF
    const handlePrintList = () => {
        printCategoriasList(filtered, {
            logoUrl: LOGO_URL,
            title: "Lista de Categorías",
            subtitle: "Categorías filtradas",
        });
    };

    const handleGeneratePdfList = async () => {
        await generateCategoriasPdf(filtered, {
            logoUrl: LOGO_URL,
            title: "Listado de Categorías",
            fileName: "novax_categorias.pdf",
        });
    };

    return (
        <div className="categorias-module py-2">
            {/* ── Cabecera ── */}
            <div className="module-header d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                <div>
                    <h1 className="h3 fw-bold text-dark mb-0 window-title">GESTIÓN DE CATEGORÍAS</h1>
                    <p className="text-muted small mb-0 mt-1">
                        {filtered.length} categoría{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <button
                        title="Imprimir lista de categorías"
                        className="btn btn-accent btn-sm rounded-pill fw-bold no-print"
                        onClick={handlePrintList}
                    >
                        🖨 Imprimir Lista
                    </button>
                    <button
                        title="Generar PDF lista de categorías"
                        className="btn btn-outline-primary btn-sm rounded-pill fw-bold no-print"
                        onClick={handleGeneratePdfList}
                    >
                        📄 PDF Lista
                    </button>
                    <button
                        title="Nueva categoría"
                        className="btn btn-success btn-sm rounded-pill fw-bold"
                        onClick={() => {
                            setSelectedCategoria({ id: 0, nombre: "", descripcion: "", createdAt: "" });
                            setOpen(true);
                        }}
                    >
                        ＋ Nueva Categoría
                    </button>
                </div>
            </div>

            {/* ── Panel de Búsqueda y Filtros ── */}
            <div className="window-card p-3 mb-4 border-gray-700 shadow-lg">
                <div className="row g-2 align-items-end">
                    <div className="col-12 col-md-4">
                        <label className="form-label small fw-bold text-uppercase mb-1">Búsqueda</label>
                        <input
                            className="form-input form-input-lg"
                            placeholder="Nombre, descripción, ID..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="col-6 col-md-2">
                        <label className="form-label small fw-bold text-uppercase mb-1">Desde</label>
                        <input
                            type="date"
                            className="form-input form-sm w-full"
                            value={filterDesde}
                            onChange={(e) => {
                                setFilterDesde(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="col-6 col-md-2">
                        <label className="form-label small fw-bold text-uppercase mb-1">Hasta</label>
                        <input
                            type="date"
                            className="form-input form-sm w-full"
                            value={filterHasta}
                            onChange={(e) => {
                                setFilterHasta(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="col-6 col-md-2 d-flex justify-content-start align-items-end">
                        <button
                            title="Limpiar filtros"
                            className="btn btn-outline-danger btn-sm rounded-pill fw-bold"
                            onClick={clearFilters}
                        >
                            ✕ Limpiar
                        </button>
                    </div>


                </div>
            </div>

            {/* ── Tabla ── */}
            <div className="window-card overflow-hidden p-0 border-gray-700 shadow-lg">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 ">
                        <thead className="table-primary">
                            <tr>
                                <th className="px-4 py-3 border-0">#</th>
                                <th className="py-3 border-0">Nombre</th>
                                <th className="py-3 border-0">Descripción</th>
                                <th className="py-3 border-0">Fecha</th>
                                <th className="pe-4 py-3 border-0 text-end">Accion</th>
                            </tr>
                        </thead>
                        <tbody className="border-0">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-3">
                                        <div className="skeleton" style={{ height: "40px" }} />
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted ">
                                        <div className="display-6 mb-2 opacity-25">📦</div>
                                        <div className="small">No se encontraron categorías</div>
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((c) => (
                                    <tr key={c.id} className="table-row-hover">
                                        <td className="px-4 text-muted small fw-bold">#{c.id}</td>
                                        <td className="fw-bold text-dark small">{c.nombre}</td>
                                        <td className="text-muted small">{c.descripcion}</td>
                                        <td className="text-muted small">{fmtDate(c.createdAt)}</td>
                                        <td className="pe-4 text-end">
                                            <button
                                                className="btn btn-sm btn-info"
                                                title="Ver detalle categoria"
                                                onClick={() => {
                                                    setSelectedCategoria(c);
                                                    setOpen(true);
                                                }}
                                            >
                                                👁
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Paginación ── */}
            {/* ── Paginación ── */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top border-primary bg-light">
                    <span className="text-primary small fw-bold">
                        Página {page} de {totalPages} · {filtered.length} registros
                    </span>
                    <div className="d-flex gap-1">
                        {/* Botón primera página */}
                        <button
                            className="btn btn-light btn-sm rounded-pill px-3 border-primary"
                            onClick={() => setPage(1)}
                            disabled={page === 1}
                        >
                            «
                        </button>

                        {/* Botón página anterior */}
                        <button
                            className="btn btn-light btn-sm rounded-pill px-3 border-primary"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            ‹
                        </button>

                        {/* Números de página */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                className={`btn btn-sm rounded-pill px-3 ${num === page ? "btn-primary fw-bold" : "btn-light border-primary"
                                    }`}
                                onClick={() => setPage(num)}
                            >
                                {num}
                            </button>
                        ))}

                        {/* Botón página siguiente */}
                        <button
                            className="btn btn-light btn-sm rounded-pill px-3 border-primary"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            ›
                        </button>

                        {/* Botón última página */}
                        <button
                            className="btn btn-light btn-sm rounded-pill px-3 border-primary"
                            onClick={() => setPage(totalPages)}
                            disabled={page === totalPages}
                        >
                            »
                        </button>
                    </div>
                </div>
            )}

            {/* ── Modal de Detalle ── */}
            <CategoriaDialog
                open={open}
                onOpenChange={setOpen}
                formData={{
                    id: selectedCategoria?.id ?? 0,
                    nombre: selectedCategoria?.nombre ?? "",
                    descripcion: selectedCategoria?.descripcion ?? "",
                    createdAt: selectedCategoria?.createdAt ?? "",
                }}

                setFormData={(data) =>
                    setSelectedCategoria((prev) =>
                        prev
                            ? { ...prev, ...data }
                            : { id: 0, nombre: "", descripcion: "", createdAt: "" }
                    )
                }

                onSave={handleSave}
                onDelete={() => handleDelete(selectedCategoria!.id)}
                isEdit={!!selectedCategoria?.id}
            />
        </div>
    )
}