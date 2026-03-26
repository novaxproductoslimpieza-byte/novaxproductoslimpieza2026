import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button"; // ✅ Importación con mayúscula
import CategoriaForm from "./CategoriaForm";
import { Categoria } from "./categoriaApi";
import { TrashIcon, PrinterIcon, FileText, FileSpreadsheet } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CategoriaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: Omit<Categoria, "id" | "createdAt">;
    setFormData: React.Dispatch<React.SetStateAction<Omit<Categoria, "id" | "createdAt">>>;
    onSave: () => void;
    onDelete?: () => void;
    onExportPDF?: () => void;
    onExportExcel?: () => void;
    isEdit: boolean;
}

export default function CategoriaDialog({
    open,
    onOpenChange,
    formData,
    setFormData,
    onSave,
    onDelete,
    onExportPDF,
    onExportExcel,
    isEdit,
}: CategoriaDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            modal={true} // ✅ bloquea interacción fuera del modal
        >
            <DialogContent
                className="sm:max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 p-6"
                onInteractOutside={(e) => e.preventDefault()} // ✅ evita cerrar con clic fuera
                onEscapeKeyDown={(e) => e.preventDefault()}   // ✅ evita cerrar con ESC
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        {isEdit ? "Editar Categoría" : "Nueva Categoría"}
                    </DialogTitle>
                    {isEdit ? (
                        <p className="text-sm text-gray-500 mt-1">
                            Administra esta categoría: puedes actualizar, eliminar o exportar sus datos.
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500 mt-1">
                            Ingresa los datos de la nueva categoría y guarda para añadirla al sistema.
                        </p>
                    )}
                </DialogHeader>

                {/* Formulario */}
                <div className="mt-4">
                    <CategoriaForm formData={formData} setFormData={setFormData} />
                </div>

                {/* Botones de acción extra solo en edición */}
                {isEdit && (
                    <div className="flex justify-between items-center mt-6">


                        {/* Botón Eliminar */}
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-red-500 text-red-600 hover:bg-red-100"
                            onClick={onDelete}
                        >
                            <TrashIcon className="h-4 w-4 text-red-600" />
                            Eliminar
                        </Button>

                        {/* Botón Imprimir */}
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={() => window.print()}
                        >
                            <PrinterIcon className="h-4 w-4 text-gray-600" />
                            Imprimir
                        </Button>

                        {/* Botón Exportar con menú */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    Exportar
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 bg-white shadow-md rounded-lg">
                                <DropdownMenuItem className="flex items-center gap-2" onClick={onExportPDF}>
                                    <FileText className="h-4 w-4 text-red-500" />
                                    Exportar PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2" onClick={onExportExcel}>
                                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                                    Exportar Excel
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                <DialogFooter className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        onClick={() => onOpenChange(false)}
                    >
                        Salir
                    </Button>
                    <Button
                        className="bg-green-600 text-white hover:bg-green-700 font-medium px-4"
                        onClick={onSave}
                        disabled={!formData?.nombre?.trim() || !formData?.descripcion?.trim()}
                    >
                        {isEdit ? "Actualizar" : "Guardar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}