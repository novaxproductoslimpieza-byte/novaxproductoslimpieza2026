import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export function SearchBox({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    return (
        <div className="relative w-64">
            <Input
                type="text"
                placeholder="Buscar categoría..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pr-10 shadow-sm border rounded-md"
            />
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
    );
}