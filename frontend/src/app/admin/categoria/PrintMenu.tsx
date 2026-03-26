import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { PrinterIcon, FileText, FileSpreadsheet } from "lucide-react";

export function PrintMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border rounded-lg shadow-sm hover:bg-gray-50">
          <PrinterIcon className="h-4 w-4 text-gray-600" />
          Imprimir
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white shadow-md rounded-lg">
        <DropdownMenuItem className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-red-500" />
          Exportar PDF
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-green-500" />
          Exportar Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}