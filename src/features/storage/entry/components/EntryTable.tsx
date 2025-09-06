import EntryModal from "./modal/EntryModal";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import DateRangePicker from "../../../../components/ui/form/RangeDatePicker"; // Corrigindo import para o componente que existe
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
import { toast } from "react-toastify";
import { useForm } from "react-hook-form"; // Import necessário para o RangeDatePicker

const EntryTable = () => {
  const { openModal, closeModal } = useModal();
  const { stockEntries, addStockEntry, updateStockEntry, deleteStockEntry } =
    useStockEntry();

  // Adicionado o useForm para o control do DatePicker
  const { control } = useForm();

  // --- FUNÇÃO HELPER ADICIONADA ---
  // Formata uma string com vírgula (ex: "1,2") para 3 casas decimais (ex: "1,200")
  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    const fixedString = numericValue.toFixed(3);
    return fixedString.replace(".", ",");
  };
  // --- FIM DA FUNÇÃO HELPER ---

  const handleCreateClick = () => {
    openModal("createStorage", EntryModal, {
      onClose: () => closeModal("createStorage"),
      onSubmit: (data: Omit<EntryData, "id">) => {
        addStockEntry(data);
        closeModal("createStorage");
      },
    });
  };

  const handleEditEntry = useCallback(
    (entry: EntryData) => {
      openModal("editStorage", EntryModal, {
        entryToEdit: entry,
        onClose: () => closeModal("editStorage"),
        onUpdate: (id: number, data: Partial<EntryData>) => {
          updateStockEntry(id, data);
          closeModal("editStorage");
        },
      });
    },
    [closeModal, openModal, updateStockEntry],
  );

  const handleDeleteEntry = useCallback(
    (id: number) => {
      if (window.confirm("Tem certeza que deseja excluir esta entrada?")) {
        deleteStockEntry(id);
        toast.success("Entrada deletada com sucesso!");
      }
    },
    [deleteStockEntry],
  );

  const columns = useMemo((): ColumnDef<EntryData>[] => {
    return [
      {
        accessorKey: "codBar",
        header: "Cód. Barras",
        cell: ({ row }) => <div className="">{row.original.codBar.value}</div>,
      },
      {
        accessorKey: "cliente",
        header: "Cliente",
        cell: ({ row }) => (
          <div className="text-right">{row.original.cliente.label}</div>
        ),
      },
      {
        accessorKey: "fabricante",
        header: "Fabricante",
        cell: ({ row }) => (
          <div className="text-right">{row.original.fabricante}</div>
        ),
      },
      {
        accessorKey: "modelo",
        header: "Modelo",
        cell: ({ row }) => (
          <div className="text-right">{row.original.modelo}</div>
        ),
      },
      {
        accessorKey: "formato",
        header: "Formato",
        cell: ({ row }) => (
          <div className="text-right">{row.original.formato}</div>
        ),
      },
      // --- MUDANÇA AQUI ---
      {
        accessorKey: "alturaChapa",
        header: "A. Chapa",
        cell: ({ row }) => (
          <div className="text-right">
            {formatDimension(row.original.alturaChapa)}
          </div>
        ),
      },
      // --- MUDANÇA AQUI ---
      {
        accessorKey: "larguraChapa",
        header: "L. Chapa",
        cell: ({ row }) => (
          <div className="text-right">
            {formatDimension(row.original.larguraChapa)}
          </div>
        ),
      },
      {
        accessorKey: "quantidade",
        header: "Qtd. Chapas",
        cell: ({ row }) => (
          <div className="text-right">{row.original.quantidade}</div>
        ),
      },
      {
        accessorKey: "m2",
        header: "Total m²",
        cell: ({ row }) => <div className="text-right">{row.original.m2}</div>,
      },
      {
        accessorKey: "quantidadeCaixas",
        header: "Qtd. Caixas",
        cell: ({ row }) => (
          <div className="text-right">{row.original.quantidadeCaixas}</div>
        ),
      },
      {
        accessorKey: "numeroNF",
        header: "Nº NF",
        cell: ({ row }) => (
          <div className="text-right">{row.original.numeroNF}</div>
        ),
      },
      {
        accessorKey: "valorNF",
        header: "Valor NF",
        cell: ({ row }) => (
          <div className="text-right">{row.original.valorNF}</div>
        ),
      },
      {
        accessorKey: "dolar",
        header: "Dólar",
        cell: ({ row }) => (
          <div className="text-right">{row.original.dolar}</div>
        ),
      },
      {
        accessorKey: "unidade",
        header: "Unidade",
        cell: ({ row }) => (
          <div className="text-right">{row.original.unidade.label}</div>
        ),
      },
      {
        accessorKey: "entryDate",
        header: "Data Entrada",
        cell: ({ row }) => {
          const date = row.original.entryDate;
          if (!date) return <div className="text-right"></div>;

          const dateOnly = date.split("T")[0];
          const [year, month, day] = dateOnly.split("-");
          return <div className="text-right">{`${day}/${month}/${year}`}</div>;
        },
      },
      {
        id: "actions",
        header: "Ações",

        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
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
      },
    ];
  }, [handleDeleteEntry, handleEditEntry]); // A função helper é estável, não precisa ser dependência.

  const filteredEntries = useMemo(() => {
    return stockEntries.filter(
      (entry) => entry.formato !== "Retalho" && entry.formato !== "Saída",
    );
  }, [stockEntries]);

  return (
    <>
      <DataTableHeader
        actions={[
          <div className="flex items-center gap-4" key="actions">
            <Button onClick={handleCreateClick}>
              <div className="flex items-center justify-center gap-2">
                <PiPlusBold />
                <span>Cadastrar Entrada</span>
              </div>
            </Button>
          </div>,
          <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-2">
            <h4 className="font-semibold text-yellow-200 text-xs">
              Movimentações de entrada irão incrementar no estoque geral e no
              estoque de terceiros.
            </h4>
          </div>,
        ]}
        onSearchChange={() => {}}
        searchPlaceholder="Buscar..."
        onFilterClick={() => {}}
        hasActiveFilters={false}
      />
      <DataTable
        columns={columns}
        data={filteredEntries}
        rowCount={filteredEntries.length}
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
