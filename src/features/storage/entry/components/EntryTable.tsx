import EntryModal from "./modal/EntryModal";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import DateRangePicker from "../../../../features/dashboard/components/Filters/DateRangePicker";
import { ColumnDef } from "@tanstack/react-table";
import { BiSolidEdit } from "react-icons/bi";
import { useMemo, useCallback } from "react";
import { useModal } from "../../../../hooks/useModal";
import { Trash } from "lucide-react";
import { EntryData, useStockEntry } from "./context/StockEntryContext";
import { PiPlusBold } from "react-icons/pi";
import {
  IconButton,
  DataTableHeader,
  Button,
} from "../../../../components/index";

const EntryTable = () => {
  const { openModal, closeModal } = useModal();

  const { stockEntries, addStockEntry, updateStockEntry, deleteStockEntry } =
    useStockEntry();

  const handleCreateClick = () => {
    openModal("createStorage", EntryModal, {
      onClose: () => closeModal("createStorage"),
      onSubmit: (data: any) => {
        addStockEntry(data as Omit<EntryData, "id">);
        closeModal("createStorage");
      },
    });
  };

  const handleEditEntry = useCallback(
    (entry: EntryData) => {
      openModal("editStorage", EntryModal, {
        onClose: () => closeModal("editStorage"),
        entryToEdit: entry,
        onUpdate: (id: any, data: any) => {
          updateStockEntry(id, data);
          closeModal("editStorage");
        },
      });
    },
    [closeModal, openModal, updateStockEntry],
  );

  const handleDeleteEntry = useCallback(
    (id: number) => {
      if (confirm("Tem certeza que deseja excluir esta entrada?")) {
        deleteStockEntry(id);
      }
    },
    [deleteStockEntry],
  );

  const columns = useMemo(() => {
    const baseColumns: ColumnDef<EntryData>[] = [
      {
        accessorKey: "codBar",
        header: "Cód. Barras",
        cell: ({ row }) => <div>{row.original.codBar.label}</div>,
      },
      {
        accessorKey: "cliente",
        header: "Cliente",
        cell: ({ row }) => <div>{row.original.cliente.label}</div>,
      },
      {
        accessorKey: "fabricante",
        header: "Fabricante",
        cell: ({ row }) => <div>{row.original.fabricante}</div>,
      },
      {
        accessorKey: "modelo",
        header: "Modelo",
        cell: ({ row }) => <div>{row.original.modelo}</div>,
      },
      {
        accessorKey: "espessura",
        header: "Espessura",
        cell: ({ row }) => <div>{row.original.espessura}</div>,
      },
      {
        accessorKey: "formato",
        header: "Formato",
        cell: ({ row }) => <div>{row.original.formato}</div>,
      },
      {
        accessorKey: "alturaChapa",
        header: "A. Chapa",
        cell: ({ row }) => <div>{row.original.alturaChapa}</div>,
      },
      {
        accessorKey: "larguraChapa",
        header: "L. Chapa",
        cell: ({ row }) => <div>{row.original.larguraChapa}</div>,
      },
      {
        accessorKey: "quantidade",
        header: "Q. Chapas",
        cell: ({ row }) => <div>{row.original.quantidade}</div>,
      },
      {
        accessorKey: "m2",
        header: "Total m²",
        cell: ({ row }) => <div>{row.original.m2}</div>,
      },
      {
        accessorKey: "numeroNF",
        header: "Nº NF",
        cell: ({ row }) => <div>{row.original.numeroNF}</div>,
      },
      {
        accessorKey: "quantidadeCaixas",
        header: "Q. Caixas",
        cell: ({ row }) => <div>{row.original.quantidadeCaixas}</div>,
      },
      {
        accessorKey: "valorNF",
        header: "Valor NF",
        cell: ({ row }) => <div>{row.original.valorNF}</div>,
      },
      {
        accessorKey: "dolar",
        header: "Dólar",
        cell: ({ row }) => <div>{row.original.dolar}</div>,
      },
      {
        accessorKey: "unidade",
        header: "Unidade",
        cell: ({ row }) => <div>{row.original.unidade.label}</div>,
      },
    ];

    baseColumns.push({
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <IconButton
            icon={<BiSolidEdit size={18} />}
            onClick={() => handleEditEntry(row.original)}
          />
          <IconButton
            icon={<Trash size={18} />}
            onClick={() => handleDeleteEntry(row.original.id)}
          />
        </div>
      ),
    });

    return baseColumns;
  }, [handleDeleteEntry, handleEditEntry]);

  return (
    <>
      <DataTableHeader
        actions={[
          <div className="flex items-center gap-6">
            <Button onClick={handleCreateClick}>
              <div className="flex items-center justify-center gap-2">
                <PiPlusBold />
                <span>Criar Entrada</span>
              </div>
            </Button>
            <DateRangePicker />
          </div>,
        ]}
      />
      <DataTable
        columns={columns}
        data={stockEntries}
        rowCount={stockEntries.length}
        pagination={{
          pageIndex: 0,
          pageSize: 10,
        }}
        setPagination={() => {}}
      />
    </>
  );
};

export default EntryTable;
