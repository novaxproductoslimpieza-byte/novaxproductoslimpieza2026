import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Categoria } from "./categoriaApi";

interface CategoriaFormProps {
  formData: Omit<Categoria, "id" | "createdAt">;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Categoria, "id" | "createdAt">>>;
}

export default function CategoriaForm({ formData, setFormData }: CategoriaFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Input
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
        />
      </div>
    </div>
  );
}