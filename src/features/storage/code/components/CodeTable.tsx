import DateRangePicker from "../../../dashboard/components/Filters/DateRangePicker";
import CodeModal from "./modal/codeModal";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useModal } from "../../../../hooks/useModal";
import { BiSolidEdit } from "react-icons/bi";
import { PiPlusBold } from "react-icons/pi";
import { BarCodeData, useBarCode } from "../context/CodeContext";
import { Trash } from "lucide-react";
import {
  IconButton,
  DataTableHeader,
  Button,
} from "../../../../components/index";

const CodeTable = () => {
  const { openModal, closeModal } = useModal();
  const { barCodes, deleteBarCode, addBarCode, updateBarCode } = useBarCode();

  const handleCreateBarCodeClick = () => {
    openModal("createBarCode", CodeModal, {
      onClose: () => closeModal("createBarCode"),
      onSubmit: (data: Omit<BarCodeData, "id">) => {
        addBarCode(data);
      },
    });
  };

  const handleEditBarCode = (barCode: BarCodeData) => {
    openModal("editBarCode", CodeModal, {
      barCode,
      onClose: () => closeModal("editBarCode"),
      onSubmit: () => {}, // Não usado na edição
      onUpdate: (id: number, data: Partial<BarCodeData>) => {
        updateBarCode(id, data);
      },
    });
  };

  const handleDeleteBarCode = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este código de barras?")) {
      deleteBarCode(id);
    }
  };

  const columns: ColumnDef<BarCodeData>[] = useMemo(() => {
    const baseColumns: ColumnDef<BarCodeData>[] = [
      {
        accessorKey: "codBar",
        header: "Código de barras",
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
        accessorKey: "modelo",
        header: "Modelo",
        enableSorting: false,
        cell: ({ row }) => <div>{row.original.modelo}</div>,
      },
      {
        accessorKey: "espessura",
        header: "Espessura",
        enableSorting: false,
        cell: ({ row }) => <div>{row.original.espessura}</div>,
      },
      {
        accessorKey: "formato",
        header: "Formato",
        enableSorting: false,
        cell: ({ row }) => <div>{row.original.formato}</div>,
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
        accessorKey: "larguraChapa",
        header: "Largura Chapa",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-right">{row.original.larguraChapa}</div>
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
      {
        accessorKey: "m2",
        header: "m²",
        enableSorting: false,
        cell: ({ row }) => <div className="text-right">{row.original.m2}</div>,
      },
    ];

    baseColumns.push({
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconButton
            icon={<BiSolidEdit size={18} className="text-white outline-none" />}
            onClick={() => handleEditBarCode(row.original)}
          />
          <IconButton
            icon={<Trash size={18} className="text-white outline-none" />}
            onClick={() => handleDeleteBarCode(row.original.id)}
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
        data={barCodes}
        rowCount={barCodes.length}
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
