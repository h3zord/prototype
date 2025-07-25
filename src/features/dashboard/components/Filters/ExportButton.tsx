import React from "react";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/components/ui/dropdown-menu";
import { Button } from "../../../../components/components/ui/button";

export interface ExportButtonProps {
  params?: {
    start: Date;
    end: Date;
    client: string;
    status: string;
    operator: string;
    espes: string;
    productType: string;
    unit: string;
  };
}

export const ExportButton: React.FC<ExportButtonProps> = ({ params }) => {
  const handleExport = (format: "excel" | "pdf") => {
    console.log("Exportando", format, params);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="ml-auto border-gray-600 text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-gray-600 bg-gray-800">
        <DropdownMenuItem
          onClick={() => handleExport("excel")}
          className="text-white"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          className="text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
