import BarCodeModal from "./modal/barcode";
import DateRangePicker from "../../../dashboard/components/Filters/DateRangePicker";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useModal } from "../../../../hooks/useModal";
import { BiSolidEdit } from "react-icons/bi";
import { PiPlusBold } from "react-icons/pi";
import { Trash } from "lucide-react";
import {
  IconButton,
  DataTableHeader,
  Button,
} from "../../../../components/index";

const CodeTable = () => {
  const { openModal, closeModal } = useModal();

  const handleCreateBarCodeClick = () => {
    openModal("createBarCode", BarCodeModal, {
      onClose: () => closeModal("createBarCode"),
    });
  };

  interface BarCodeData {
    id: number;
    codBar: string;
    fabricante: string;
    espessura: string;
    modelo: string;
    formato: string;
    m2: string;
    larguraChapa: string;
    alturaChapa: string;
    quantidade: number;
  }

  const barCodeData: BarCodeData[] = [
    {
      id: 1,
      codBar: "7891234567890",
      fabricante: "Dupont",
      espessura: "1.14 - ESXR",
      modelo: "ESXR 045",
      formato: "1,067 x 1,524",
      m2: "1.627",
      larguraChapa: "1.067",
      alturaChapa: "1.524",
      quantidade: 50,
    },
    {
      id: 2,
      codBar: "7891234567891",
      fabricante: "Kodak",
      espessura: "1.14 - NX",
      modelo: "NX Standard",
      formato: "0,90 x 1,20",
      m2: "1.080",
      larguraChapa: "0.900",
      alturaChapa: "1.200",
      quantidade: 75,
    },
    {
      id: 3,
      codBar: "7891234567892",
      fabricante: "XSYS",
      espessura: "1.17 - ESXR",
      modelo: "ESXR Premium",
      formato: "1,27 x 2,032",
      m2: "2.581",
      larguraChapa: "1.270",
      alturaChapa: "2.032",
      quantidade: 30,
    },
    {
      id: 4,
      codBar: "7891234567893",
      fabricante: "Dupont",
      espessura: "3.94 - TDR",
      modelo: "TDR Heavy",
      formato: "0,61 x 0,762 - NX",
      m2: "0.465",
      larguraChapa: "0.610",
      alturaChapa: "0.762",
      quantidade: 120,
    },
    {
      id: 5,
      codBar: "7891234567894",
      fabricante: "Kodak",
      espessura: "6.35 - DEC",
      modelo: "DEC Pro",
      formato: "Retalho",
      m2: "0.850",
      larguraChapa: "0.850",
      alturaChapa: "1.000",
      quantidade: 25,
    },
    {
      id: 6,
      codBar: "7891234567895",
      fabricante: "XSYS",
      espessura: "1.14 - NX",
      modelo: "NX Advanced",
      formato: "1,067 x 1,524",
      m2: "1.627",
      larguraChapa: "1.067",
      alturaChapa: "1.524",
      quantidade: 80,
    },
    {
      id: 7,
      codBar: "7891234567896",
      fabricante: "Dupont",
      espessura: "1.17 - ESXR",
      modelo: "ESXR Ultra",
      formato: "0,90 x 1,20",
      m2: "1.080",
      larguraChapa: "0.900",
      alturaChapa: "1.200",
      quantidade: 65,
    },
    {
      id: 8,
      codBar: "7891234567897",
      fabricante: "Kodak",
      espessura: "3.94 - TDR",
      modelo: "TDR Standard",
      formato: "1,27 x 2,032",
      m2: "2.581",
      larguraChapa: "1.270",
      alturaChapa: "2.032",
      quantidade: 40,
    },
  ];

  const columns: ColumnDef<BarCodeData>[] = useMemo(() => {
    const baseColumns: ColumnDef<BarCodeData>[] = [
      {
        accessorKey: "codBar",
        header: "Cód. Barras",
        enableSorting: false,
        cell: ({ row }) => <div className="">{row.original.codBar}</div>,
      },
      {
        accessorKey: "fabricante",
        header: "Fabricante",
        enableSorting: false,
        cell: ({ row }) => <div>{row.original.fabricante}</div>,
      },
      {
        accessorKey: "espessura",
        header: "Espessura",
        enableSorting: false,
        cell: ({ row }) => <div>{row.original.espessura}</div>,
      },
      {
        accessorKey: "modelo",
        header: "Modelo",
        enableSorting: false,
        cell: ({ row }) => <div>{row.original.modelo}</div>,
      },
      {
        accessorKey: "formato",
        header: "Formato",
        enableSorting: false,
        cell: ({ row }) => <div>{row.original.formato}</div>,
      },
      {
        accessorKey: "m2",
        header: "m²",
        enableSorting: false,
        cell: ({ row }) => <div className="text-right">{row.original.m2}</div>,
      },
      {
        accessorKey: "larguraChapa",
        header: "Largura Chapa",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-right">{row.original.larguraChapa}</div>
        ),
      },
      {
        accessorKey: "alturaChapa",
        header: "Altura Chapa",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-right">{row.original.alturaChapa}</div>
        ),
      },
      {
        accessorKey: "quantidade",
        header: "Quantidade",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-right font-medium">
            {row.original.quantidade}
          </div>
        ),
      },
    ];

    baseColumns.push({
      id: "actions",
      header: "Ações",
      cell: () => (
        <div className="flex items-center gap-1">
          <IconButton
            icon={<BiSolidEdit size={18} className="text-white outline-none" />}
          />
          <IconButton
            icon={<Trash size={18} className="text-white outline-none" />}
          />
        </div>
      ),
    });

    return baseColumns;
  }, []);

  return (
    <>
      <DataTableHeader
        actions={[
          <div className="flex items-center gap-6" key="actions">
            <Button onClick={handleCreateBarCodeClick}>
              <div className="flex items-center justify-center gap-2">
                <PiPlusBold />
                <span>Cadastrar Código de barras</span>
              </div>
            </Button>
            <DateRangePicker />
          </div>,
        ]}
      />
      <DataTable
        columns={columns}
        data={barCodeData}
        rowCount={barCodeData.length}
        pagination={{
          pageIndex: 0,
          pageSize: 10,
        }}
        setPagination={() => {}}
      />
    </>
  );
};

export default CodeTable;
