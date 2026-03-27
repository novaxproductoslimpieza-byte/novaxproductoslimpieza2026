"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import CategoriaForm from "./CategoriaForm";
import { Categoria } from "./categoriaApi";
import { TrashIcon, PrinterIcon, FileText, FileSpreadsheet } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { printCategoriaDetail } from "@/lib/print";
import { generateCategoriaDetailPdf } from "@/lib/pdf";

interface CategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Categoria;
  setFormData: React.Dispatch<React.SetStateAction<Categoria | null>>;
  onSave: (formData: Categoria) => Promise<void>;
  onDelete?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  isEdit: boolean;
}

const LOGO_URL = encodeURI("/images/config_web/logonovax.png");
const CONTACT_INFO = {
  companyName: "Novax Plus",
  phone: "(000) 000-0000",
  email: "contacto@novax.com",
  address: "Calle Falsa 123, Ciudad",
};

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
  // Estado para el modal de confirmación de eliminación y carga
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      if (onDelete) await onDelete();
      setDeleteModal(false);
      onOpenChange(false); // Cierra el dialogo principal también tras borrar éxito
    } catch (err: any) {
      let msg = err.message || "No se pudo eliminar la categoría.";
      
      // Intentar extraer el JSON del mensaje (formato "Error 400: {...}")
      const jsonMatch = msg.match(/\{.*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          msg = parsed.error || parsed.message || msg;
        } catch (e) { }
      } else if (msg.includes("Error ")) {
          msg = msg.replace(/Error \d+: /, "");
      }

      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent
        className="sm:max-w-md bg-white rounded-2xl shadow-2xl border-0 p-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="bg-linear-to-r from-gray-900 to-gray-800 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {isEdit ? "Detalle de Categoría" : "Nueva Categoría"}
            </DialogTitle>
            <p className="text-gray-300 text-sm mt-1">
              {isEdit ? "#" + formData.id + " / " + formData.nombre : "Crea un nuevo grupo para tus productos."}
            </p>
          </DialogHeader>
        </div>

        {/* Formulario */}
        <div className="p-6">
          <CategoriaForm formData={formData} setFormData={setFormData} onSave={onSave} />
        </div>

        {/* Botones extra solo en edición */}
        {isEdit && (
          <div className="flex flex-wrap gap-2 px-6 pb-2">
            {/* Botón Eliminar */}
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all font-bold rounded-xl h-10"
              onClick={() => {
                setDeleteError(null);
                setDeleteModal(true);
              }}
            >
              <TrashIcon className="h-4 w-4" />
              Eliminar
            </Button>

            {/* Botón Imprimir */}
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 border-gray-100 text-gray-700 hover:bg-gray-50 transition-all font-bold rounded-xl h-10"
              onClick={() =>
                printCategoriaDetail(formData, {
                  logoUrl: LOGO_URL,
                  title: "Detalle de Categoría",
                  subtitle: `Categoría: ${formData.nombre}`,
                })
              }
            >
              <PrinterIcon className="h-4 w-4" />
              Imprimir
            </Button>

            {/* Exportar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2 border-gray-100 text-gray-700 hover:bg-gray-50 transition-all font-bold rounded-xl h-10"
                >
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white shadow-xl rounded-xl border border-gray-100">
                <DropdownMenuItem
                  className="flex items-center gap-2 p-2.5 cursor-pointer hover:bg-red-50"
                  onClick={() =>
                    generateCategoriaDetailPdf(formData, {
                      logoUrl: LOGO_URL,
                      title: "Detalle de Categoría",
                      fileName: `novax_categoria_${formData.nombre}.pdf`,
                    })
                  }
                >
                  <FileText className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Exportar PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 p-2.5 cursor-pointer hover:bg-green-50" onClick={onExportExcel}>
                  <FileSpreadsheet className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Exportar Excel</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="bg-gray-50 p-6 flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 font-bold px-4"
            onClick={() => onOpenChange(false)}
          >
            Salir
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700 font-bold px-8 h-12 rounded-xl transition-all shadow-lg shadow-green-200 active:scale-95"
            onClick={() => {
              const btn = document.getElementById('categoria-form-submit');
              if (btn) btn.click();
            }}
            disabled={!formData?.nombre?.trim()}
          >
            {isEdit ? "Actualizar Datos" : "Crear Categoría"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Modal de confirmación de eliminación profesional */}
      <Dialog open={deleteModal} onOpenChange={(o) => !isDeleting && setDeleteModal(o)}>
        <DialogContent className="sm:max-w-xs bg-white rounded-2xl shadow-2xl p-0 overflow-hidden border-0">
          <div className="bg-red-500 p-4 flex justify-center">
            <TrashIcon className="h-10 w-10 text-white animate-pulse" />
          </div>
          
          <div className="p-6 text-center">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-800 text-center w-full">
                {deleteError ? "No se puede eliminar" : "Confirmar Eliminación"}
              </DialogTitle>
            </DialogHeader>
            
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              {deleteError ? deleteError : `¿Estás seguro de que deseas eliminar la categoría "${formData.nombre}"?`}
            </p>

            {deleteError && deleteError.toLowerCase().includes("pedido") && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2 text-left">
                <span className="text-amber-500 mt-0.5">💡</span>
                <p className="text-[11px] text-amber-700 leading-tight">
                  Esta categoría tiene pedidos vinculados. Debes eliminar primero los productos asociados o las dependencias de pedidos.
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2">
              {!deleteError ? (
                <>
                  <Button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    {isDeleting ? "Eliminando..." : "Sí, Eliminar"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setDeleteModal(false)}
                    disabled={isDeleting}
                    className="w-full text-gray-500 font-bold py-2"
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setDeleteModal(false)}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
                >
                  Cerrar
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}