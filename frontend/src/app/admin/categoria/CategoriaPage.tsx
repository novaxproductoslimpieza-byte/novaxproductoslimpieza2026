"use client";

import { useEffect, useState } from "react";
import { categoriaApi, Categoria } from "./categoriaApi";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";

import { SearchBox } from "./SearchBox";
import { PrintMenu } from "./PrintMenu";
import { DateFilter } from "./DateFilter";
import CategoriaDialog from "./CategoriaDialog";

export default function CategoriaPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [open, setOpen] = useState(false);


    const [formData, setFormData] = useState<Omit<Categoria, "id" | "createdAt">>({
        nombre: "",
        descripcion: "",
    });
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 10;
    const totalPages = Math.ceil(categorias.length / pageSize);

    const paginatedData = categorias
        .filter((cat) =>
            cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => {
        loadCategorias();
    }, []);

    const loadCategorias = async () => {
        const data = await categoriaApi.getCategorias();
        setCategorias(data);
    };

    const handleSave = async () => {
        try {
            if (selectedCategoria) {
                // edición
                await categoriaApi.updateCategoria(selectedCategoria.id, formData);
            } else {
                // creación
                await categoriaApi.createCategoria(formData);
            }
            setOpen(false);
            setFormData({ nombre: "", descripcion: "" });
            setSelectedCategoria(null);
            loadCategorias();
        } catch (error) {
            console.error("Error al guardar categoría:", error);
        }
    };

    const handleDelete = async (id: number) => {
        await categoriaApi.deleteCategoria(id);
        loadCategorias();
    };

    return (
        <div className="p-6 space-y-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
                <Button
                    onClick={() => {
                        setSelectedCategoria(null);
                        setFormData({ nombre: "", descripcion: "" });
                        setOpen(true);
                    }}
                >
                    + Nueva Categoría
                </Button>
            </div>

            {/* Barra de acciones */}
            <Card className="shadow-md">
                <CardContent className="flex items-center gap-4 py-4">
                    <SearchBox value={searchTerm} onChange={setSearchTerm} />
                    <DateFilter />
                    <PrintMenu />
                </CardContent>
            </Card>

            {/* Lista */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Lista de Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-blue-600">
                                <TableHead className="text-white font-semibold px-4 py-2">Nombre</TableHead>
                                <TableHead className="text-white font-semibold px-4 py-2">Descripción</TableHead>
                                <TableHead className="text-white font-semibold px-4 py-2">Fecha de creación</TableHead>
                                <TableHead className="text-white font-semibold px-4 py-2">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((cat, index) => (
                                <TableRow
                                    key={cat.id}
                                    className={index % 2 === 0 ? "bg-gray-100 hover:bg-gray-200" : "bg-white hover:bg-gray-50"}
                                >
                                    <TableCell className="px-4 py-2">{cat.nombre}</TableCell>
                                    <TableCell className="px-4 py-2">{cat.descripcion}</TableCell>
                                    <TableCell className="px-4 py-2">
                                        {cat.createdAt
                                            ? new Date(cat.createdAt).toLocaleDateString("es-ES", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "—"}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 flex gap-2">

                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
                                            onClick={() => {
                                                setSelectedCategoria(cat);
                                                setFormData({
                                                    nombre: cat.nombre ?? "",        // si viene null, lo convertimos a ""
                                                    descripcion: cat.descripcion ?? ""
                                                });
                                                setOpen(true);
                                            }}
                                        >
                                            <PencilIcon className="h-4 w-4 text-blue-600" />
                                            Editar
                                        </Button>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Paginación */}
            <div className="flex justify-between items-center">
                <span>
                    Mostrando página {currentPage} de {totalPages}
                </span>
                <ButtonGroup>
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        size="sm"
                        variant="outline"
                    >
                        <ChevronLeftIcon className="mr-1 h-4 w-4" />
                        Anterior
                    </Button>
                    {[...Array(totalPages)].map((_, i) => (
                        <Button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            size="sm"
                            variant={currentPage === i + 1 ? "default" : "outline"}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        size="sm"
                        variant="outline"
                    >
                        Siguiente
                        <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Button>
                </ButtonGroup>
            </div>

            {/* Diálogo Crear/Editar */}
            <CategoriaDialog
                open={open}
                onOpenChange={(val) => {
                    if (!val) setSelectedCategoria(null);
                    setOpen(val);
                }}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                onDelete={async () => {
                    if (selectedCategoria) {
                        await categoriaApi.deleteCategoria(selectedCategoria.id); // ✅ elimina en backend
                        setSelectedCategoria(null);                               // limpia selección
                        setOpen(false);                                           // cierra modal
                        loadCategorias();                                         // refresca lista
                    }
                }}
                isEdit={!!selectedCategoria}
            />
        </div>
    );
}