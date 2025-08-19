import TestModal from "./modal/test";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { BiSolidEdit } from "react-icons/bi";
import { PiPlusBold } from "react-icons/pi";
import {
  IconButton,
  DataTableHeader,
  Button,
} from "../../../../components/index";
import { useModal } from "../../../../hooks/useModal";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { Trash } from "lucide-react";

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
    lct: string;
    espessura: string;
    tipo: string;
    aChapa: string;
    lChapa: string;
    nChapa: number;
    m2: string;
    aproveitamento: string;
    sobraM2: string;
    data: string;
    hora: string;
    usuario: string;
    uni: string;
  }

  const stockData: StockData[] = [
    {
      id: 1,
      codigo: "001208",
      lct: "LCT001",
      espessura: "1.14 - NX",
      tipo: "NX 1.14",
      aChapa: "0,80",
      lChapa: "1,07",
      nChapa: 80,
      m2: "68,288",
      aproveitamento: "85%",
      sobraM2: "10,243",
      data: "04/06/2025",
      hora: "08:30",
      usuario: "João Silva",
      uni: "SP",
    },
    {
      id: 2,
      codigo: "001209",
      lct: "LCT002",
      espessura: "TIL",
      tipo: "TIL",
      aChapa: "0,84",
      lChapa: "1,10",
      nChapa: 80,
      m2: "73,543",
      aproveitamento: "90%",
      sobraM2: "7,354",
      data: "04/06/2025",
      hora: "09:15",
      usuario: "Maria Santos",
      uni: "SP",
    },
    {
      id: 3,
      codigo: "001210",
      lct: "LCT003",
      espessura: "6.35 - DEC",
      tipo: "DEC 250",
      aChapa: "1,07",
      lChapa: "1,52",
      nChapa: 60,
      m2: "97,566",
      aproveitamento: "78%",
      sobraM2: "21,465",
      data: "04/06/2025",
      hora: "10:00",
      usuario: "Pedro Costa",
      uni: "RS",
    },
    {
      id: 4,
      codigo: "001211",
      lct: "LCT004",
      espessura: "1.14 - ESXR",
      tipo: "ESXR 045",
      aChapa: "1,07",
      lChapa: "1,27",
      nChapa: 48,
      m2: "65,044",
      aproveitamento: "92%",
      sobraM2: "5,204",
      data: "04/06/2025",
      hora: "11:30",
      usuario: "Ana Oliveira",
      uni: "RS",
    },
    {
      id: 5,
      codigo: "001212",
      lct: "LCT005",
      espessura: "1.70 - ESXR",
      tipo: "ESXR 067",
      aChapa: "1,07",
      lChapa: "1,52",
      nChapa: 20,
      m2: "32,522",
      aproveitamento: "88%",
      sobraM2: "3,903",
      data: "04/06/2025",
      hora: "14:15",
      usuario: "Carlos Lima",
      uni: "RS",
    },
    {
      id: 6,
      codigo: "001213",
      lct: "LCT006",
      espessura: "1.14 - ESXR",
      tipo: "ESXR 045",
      aChapa: "1,07",
      lChapa: "1,52",
      nChapa: 48,
      m2: "78,053",
      aproveitamento: "95%",
      sobraM2: "3,903",
      data: "04/06/2025",
      hora: "15:00",
      usuario: "Lucia Ferreira",
      uni: "RS",
    },
    {
      id: 7,
      codigo: "001214",
      lct: "LCT007",
      espessura: "3.94 - TDR",
      tipo: "EPC 155",
      aChapa: "1,27",
      lChapa: "2,03",
      nChapa: 6,
      m2: "15,484",
      aproveitamento: "82%",
      sobraM2: "2,787",
      data: "04/06/2025",
      hora: "16:30",
      usuario: "Roberto Alves",
      uni: "RS",
    },
    {
      id: 8,
      codigo: "001215",
      lct: "LCT008",
      espessura: "1.14 - ESXR",
      tipo: "ESXR 045",
      aChapa: "1,07",
      lChapa: "1,27",
      nChapa: 60,
      m2: "81,305",
      aproveitamento: "89%",
      sobraM2: "8,944",
      data: "05/06/2025",
      hora: "08:00",
      usuario: "Fernanda Rocha",
      uni: "SP",
    },
    {
      id: 9,
      codigo: "001216",
      lct: "LCT009",
      espessura: "1.70 - ESXR",
      tipo: "ESXR 067",
      aChapa: "1,07",
      lChapa: "1,52",
      nChapa: 20,
      m2: "32,522",
      aproveitamento: "91%",
      sobraM2: "2,927",
      data: "05/06/2025",
      hora: "09:30",
      usuario: "Daniel Souza",
      uni: "SP",
    },
    {
      id: 10,
      codigo: "001217",
      lct: "LCT010",
      espessura: "1.14 - ESXR",
      tipo: "ESXR 045",
      aChapa: "1,07",
      lChapa: "1,52",
      nChapa: 36,
      m2: "58,340",
      aproveitamento: "87%",
      sobraM2: "7,584",
      data: "05/06/2025",
      hora: "11:00",
      usuario: "Patrícia Mendes",
      uni: "SP",
    },
    {
      id: 11,
      codigo: "TOTAL",
      lct: "",
      espessura: "",
      tipo: "",
      aChapa: "",
      lChapa: "",
      nChapa: 458,
      m2: "602,667",
      aproveitamento: "88%",
      sobraM2: "74,314",
      data: "",
      hora: "",
      usuario: "",
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
        accessorKey: "lct",
        header: "LCTO",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.lct}
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
        accessorKey: "tipo",
        header: "Tipo",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.tipo}
            </div>
          );
        },
      },
      {
        accessorKey: "aChapa",
        header: "A.Chapa",
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
        header: "L.Chapa",
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
        accessorKey: "nChapa",
        header: "N.Chapa",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.nChapa}
            </div>
          );
        },
      },
      {
        accessorKey: "m2",
        header: "M2",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.m2}
            </div>
          );
        },
      },
      {
        accessorKey: "aproveitamento",
        header: "% Aprov.",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.aproveitamento}
            </div>
          );
        },
      },
      {
        accessorKey: "sobraM2",
        header: "Sobra M2",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.sobraM2}
            </div>
          );
        },
      },
      {
        accessorKey: "data",
        header: "Data",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.data}
            </div>
          );
        },
      },
      {
        accessorKey: "hora",
        header: "Hora",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.hora}
            </div>
          );
        },
      },
      {
        accessorKey: "usuario",
        header: "Usuário",
        enableSorting: false,
        cell: ({ row, table }) => {
          const isLastRow = row.index === table.getRowModel().rows.length - 1;
          return (
            <div className={isLastRow ? "font-bold" : ""}>
              {row.original.usuario}
            </div>
          );
        },
      },
      {
        accessorKey: "uni",
        header: "Uni",
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
              icon={<Trash size={18} className="text-white outline-none" />}
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
                <span>Criar Saída</span>
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
