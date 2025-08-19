import TestModal from "./modal/test";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FiShoppingCart } from "react-icons/fi";
import { BiSolidEdit } from "react-icons/bi";
import { PiPlusBold } from "react-icons/pi";
import {
  IconButton,
  DataTableHeader,
  Button,
} from "../../../../components/index";
import { useModal } from "../../../../hooks/useModal";
import DataTable from "../../../../components/ui/table/data-table/DataTable";

const RecordingTable = () => {
  const { openModal, closeModal } = useModal();

  const handleCreateClick = () => {
    openModal("createStorage", TestModal, {
      onClose: () => closeModal("createStorage"),
    });
  };

  interface StockData {
    id: number;
    codigo: string;
    entrada: string;
    empresa: string;
    fabricante: string;
    espessura: string;
    refChapa: string;
    aChapa: string;
    lChapa: string;
    qChapa: number;
    totalM2: string;
    vlM2: string;
    numNF: string;
    valorNF: string;
    dolar: string;
    uni: string;
  }

  const stockData: StockData[] = [
    {
      id: 1,
      codigo: "001208",
      entrada: "04/06/2025",
      empresa: "FLEXOGRAV SP",
      fabricante: "Kodak",
      espessura: "1.14 - NX",
      refChapa: "NX 1.14",
      aChapa: "0,80",
      lChapa: "1,07",
      qChapa: 80,
      totalM2: "68,288",
      vlM2: "R$ 488,69",
      numNF: "093.403",
      valorNF: "R$ 33.371,88",
      dolar: "R$ 5,71",
      uni: "SP",
    },
    {
      id: 2,
      codigo: "001209",
      entrada: "04/06/2025",
      empresa: "FLEXOGRAV SP",
      fabricante: "Kodak",
      espessura: "TIL",
      refChapa: "TIL",
      aChapa: "0,84",
      lChapa: "1,10",
      qChapa: 80,
      totalM2: "73,543",
      vlM2: "R$ 551,35",
      numNF: "093.403",
      valorNF: "R$ 40.547,59",
      dolar: "R$ 5,71",
      uni: "SP",
    },
    {
      id: 3,
      codigo: "001210",
      entrada: "04/06/2025",
      empresa: "Flexograv Farroupilha",
      fabricante: "Dupont",
      espessura: "6.35 - DEC",
      refChapa: "DEC 250",
      aChapa: "1,07",
      lChapa: "1,52",
      qChapa: 60,
      totalM2: "97,566",
      vlM2: "R$ 759,71",
      numNF: "085.226",
      valorNF: "R$ 74.121,51",
      dolar: "R$ 5,69",
      uni: "RS",
    },
    {
      id: 4,
      codigo: "001211",
      entrada: "04/06/2025",
      empresa: "Flexograv Farroupilha",
      fabricante: "Dupont",
      espessura: "1.14 - ESXR",
      refChapa: "ESXR 045",
      aChapa: "1,07",
      lChapa: "1,27",
      qChapa: 48,
      totalM2: "65,044",
      vlM2: "R$ 550,28",
      numNF: "085.226",
      valorNF: "R$ 35.792,69",
      dolar: "R$ 5,69",
      uni: "RS",
    },
    {
      id: 5,
      codigo: "001212",
      entrada: "04/06/2025",
      empresa: "Flexograv Farroupilha",
      fabricante: "Dupont",
      espessura: "1.70 - ESXR",
      refChapa: "ESXR 067",
      aChapa: "1,07",
      lChapa: "1,52",
      qChapa: 20,
      totalM2: "32,522",
      vlM2: "R$ 599,97",
      numNF: "085.226",
      valorNF: "R$ 19.512,12",
      dolar: "R$ 5,69",
      uni: "RS",
    },
    {
      id: 6,
      codigo: "001213",
      entrada: "04/06/2025",
      empresa: "Flexograv Farroupilha",
      fabricante: "Dupont",
      espessura: "1.14 - ESXR",
      refChapa: "ESXR 045",
      aChapa: "1,07",
      lChapa: "1,52",
      qChapa: 48,
      totalM2: "78,053",
      vlM2: "R$ 550,28",
      numNF: "085.226",
      valorNF: "R$ 42.950,78",
      dolar: "R$ 5,69",
      uni: "RS",
    },
    {
      id: 7,
      codigo: "001214",
      entrada: "04/06/2025",
      empresa: "Flexograv Farroupilha",
      fabricante: "Dupont",
      espessura: "3.94 - TDR",
      refChapa: "EPC 155",
      aChapa: "1,27",
      lChapa: "2,03",
      qChapa: 6,
      totalM2: "15,484",
      vlM2: "R$ 748,78",
      numNF: "085.226",
      valorNF: "R$ 11.594,11",
      dolar: "R$ 5,69",
      uni: "RS",
    },
    {
      id: 8,
      codigo: "001215",
      entrada: "05/06/2025",
      empresa: "FLEXOGRAV SP",
      fabricante: "Dupont",
      espessura: "1.14 - ESXR",
      refChapa: "ESXR 045",
      aChapa: "1,07",
      lChapa: "1,27",
      qChapa: 60,
      totalM2: "81,305",
      vlM2: "R$ 562,79",
      numNF: "085.285",
      valorNF: "R$ 45.757,89",
      dolar: "R$ 5,67",
      uni: "SP",
    },
    {
      id: 9,
      codigo: "001216",
      entrada: "05/06/2025",
      empresa: "FLEXOGRAV SP",
      fabricante: "Dupont",
      espessura: "1.70 - ESXR",
      refChapa: "ESXR 067",
      aChapa: "1,07",
      lChapa: "1,52",
      qChapa: 20,
      totalM2: "32,522",
      vlM2: "R$ 641,03",
      numNF: "085.285",
      valorNF: "R$ 20.847,73",
      dolar: "R$ 5,67",
      uni: "SP",
    },
    {
      id: 10,
      codigo: "001217",
      entrada: "05/06/2025",
      empresa: "FLEXOGRAV SP",
      fabricante: "Dupont",
      espessura: "1.14 - ESXR",
      refChapa: "ESXR 045",
      aChapa: "1,07",
      lChapa: "1,52",
      qChapa: 36,
      totalM2: "58,340",
      vlM2: "R$ 562,78",
      numNF: "085.285",
      valorNF: "R$ 32.945,38",
      dolar: "R$ 5,67",
      uni: "SP",
    },
    {
      id: 11,
      codigo: "TOTAL",
      entrada: "",
      empresa: "",
      fabricante: "",
      espessura: "",
      refChapa: "",
      aChapa: "",
      lChapa: "",
      qChapa: 458,
      totalM2: "602,667",
      vlM2: "",
      numNF: "",
      valorNF: "R$ 357.441,68",
      dolar: "",
      uni: "",
    },
  ];

  const columns: ColumnDef<StockData>[] = useMemo(() => {
    const baseColumns: ColumnDef<StockData>[] = [
      {
        accessorKey: "codigo",
        header: "Código",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.codigo}
            </div>
          );
        },
      },
      {
        accessorKey: "entrada",
        header: "Entrada",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.entrada}
            </div>
          );
        },
      },
      {
        accessorKey: "empresa",
        header: "Empresa",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.empresa}
            </div>
          );
        },
      },
      {
        accessorKey: "fabricante",
        header: "Fabricante",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.fabricante}
            </div>
          );
        },
      },
      {
        accessorKey: "espessura",
        header: "Espessura",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.espessura}
            </div>
          );
        },
      },
      {
        accessorKey: "refChapa",
        header: "Ref. Chapa",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.refChapa}
            </div>
          );
        },
      },
      {
        accessorKey: "aChapa",
        header: "A. Chapa",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.aChapa}
            </div>
          );
        },
      },
      {
        accessorKey: "lChapa",
        header: "L. Chapa",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.lChapa}
            </div>
          );
        },
      },
      {
        accessorKey: "qChapa",
        header: "Q. Chapas",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.qChapa}
            </div>
          );
        },
      },
      {
        accessorKey: "totalM2",
        header: "Total m²",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.totalM2}
            </div>
          );
        },
      },
      {
        accessorKey: "vlM2",
        header: "VL m²",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.vlM2}
            </div>
          );
        },
      },
      {
        accessorKey: "numNF",
        header: "Nº NF",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.numNF}
            </div>
          );
        },
      },
      {
        accessorKey: "valorNF",
        header: "Valor NF",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.valorNF}
            </div>
          );
        },
      },
      {
        accessorKey: "dolar",
        header: "Dólar",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.dolar}
            </div>
          );
        },
      },
      {
        accessorKey: "uni",
        header: "Uni.",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.uni}
            </div>
          );
        },
      },
    ];

    baseColumns.push({
      id: "actions",
      header: "Ações",
      cell: ({ row, table }) => {
        const rowIndex = row.index;
        const totalRows = table.getRowModel().rows.length;

        if (rowIndex === totalRows - 1) {
          return null;
        }

        return (
          <div className="flex items-center gap-1">
            <IconButton
              icon={
                <BiSolidEdit size={18} className="text-white outline-none" />
              }
            />
            <IconButton
              icon={
                <FiShoppingCart size={18} className="text-white outline-none" />
              }
            />
          </div>
        );
      },
    });

    return baseColumns;
  }, []);

  return (
    <>
      <DataTableHeader
        actions={[
          <div className="flex items-center gap-6">
            <Button onClick={handleCreateClick}>
              <div className="flex items-center justify-center gap-2">
                <PiPlusBold />
                <span>Incluir</span>
              </div>
            </Button>
            <div className="text-[12px] text-[white] flex items-center justify-center gap-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#facc15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Exibindo resultados do perído{" "}
              <strong className="text-[#fde047]">01/07/25 à 18/07/25</strong>
            </div>
          </div>,
        ]}
      />
      <DataTable
        columns={columns}
        data={stockData}
        rowCount={10}
        pagination={{
          pageIndex: 0,
          pageSize: -1,
        }}
        setPagination={() => {}}
      />
    </>
  );
};

export default RecordingTable;
