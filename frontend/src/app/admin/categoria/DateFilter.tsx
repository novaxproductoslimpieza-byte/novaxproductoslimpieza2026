import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DateFilter() {
  return (
    <div className="flex items-center gap-2">
      <Label>Desde:</Label>
      <Input type="date" />
      <Label>Hasta:</Label>
      <Input type="date" />
    </div>
  );
}