"use client";

import { useState } from "react";
import { validateCategoryName } from "@/lib/validations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Categoria } from "./categoriaApi";

interface Props {
  formData: Categoria;
  setFormData: React.Dispatch<React.SetStateAction<Categoria | null>>;
  onSave: (formData: Categoria) => Promise<void>;
}

export default function CategoriaForm({ formData, setFormData, onSave }: Props) {
  const [errorModal, setErrorModal] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ nombre?: string; descripcion?: string }>({});

  const handleNombreChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, nombre: value }));
    const error = validateCategoryName(value);
    setErrors((prev) => ({ ...prev, nombre: error || "" }));
  };

  const closeErrorModal = () => {
    setErrorModal({ open: false, msg: "" });
    setFormData((prev: any) => ({ ...prev, nombre: "" }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const nombreError = validateCategoryName(formData.nombre);
    if (nombreError) {
      setErrors({ nombre: nombreError });
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      setErrors({});
    } catch (err: any) {
      let msg = err.message || "Error inesperado en el servidor.";
      
      // Intentar extraer el JSON del mensaje (formato "Error 400: {...}")
      const jsonMatch = msg.match(/\{.*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          msg = parsed.error || parsed.message || msg;
        } catch (e) { }
      } else if (msg.includes("Error ")) {
          // Si no es JSON pero tiene el prefijo de error
          msg = msg.replace(/Error \d+: /, "");
      }

      setErrorModal({ open: true, msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <label htmlFor="nombre" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Nombre de la Categoría
          </label>
          <input
            id="nombre"
            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all shadow-sm ${
              errors.nombre ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Ej. Detergentes, Limpieza..."
            value={formData.nombre}
            onChange={(e) => handleNombreChange(e.target.value)}
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1 font-medium">{errors.nombre}</p>}
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Descripción Detallada
          </label>
          <textarea
            id="descripcion"
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all shadow-sm resize-none"
            placeholder="Describe qué productos pertenecen a esta categoría..."
            value={formData.descripcion}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, descripcion: e.target.value }))}
          />
        </div>

        {/* Botón oculto para permitir el envío con 'Enter' */}
        <button type="submit" className="hidden" id="categoria-form-submit" disabled={loading}>
          Guardar
        </button>
      </form>

      {/* Modal de error profesional */}
      <Dialog open={errorModal.open} onOpenChange={(o) => !o && closeErrorModal()}>
        <DialogContent className="sm:max-w-xs bg-white rounded-2xl shadow-2xl p-0 overflow-hidden border-0">
          <div className="bg-red-500 p-4 flex justify-center">
            <span className="text-3xl text-white">⚠️</span>
          </div>
          <div className="p-6 text-center">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-800 text-center w-full">
                {errorModal.msg.includes("existe") ? "Categoría Duplicada" : "Error de Validación"}
              </DialogTitle>
            </DialogHeader>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              {errorModal.msg}
            </p>
            <div className="mt-6">
              <Button
                onClick={closeErrorModal}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Entendido
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}