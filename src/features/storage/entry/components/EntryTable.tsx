import React, { useMemo, useCallback, useState } from "react";
import {
  ColumnDef,
  Row,
  flexRender,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import EntryModal from "./modal/EntryModal";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { BiSolidEdit } from "react-icons/bi";
import { useModal } from "../../../../hooks/useModal";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";
import { EntryData, useStockEntry } from "../context/StockEntryContext";
import { PiPlusBold } from "react-icons/pi";
import { AlertBox } from "../../../../components/components/ui/AlertBox";
import {
  IconButton,
  DataTableHeader,
  Button,
} from "../../../../components/index";
import {
  TableCell,
  TableRow,
} from "../../../../components/components/ui/table";

// ---- RowShape precisa cumprir o contrato do DataTable (isHeader + id)
type RowShape = EntryData & { isHeader: boolean };

const EntryTable = () => {
  const { openModal, closeModal } = useModal();
  const { stockEntries, addStockEntry, updateStockEntry, deleteStockEntry } =
    useStockEntry();

  // ---- Estados obrigatórios do DataTable (evita stubs que quebram tipagem)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredEntries = useMemo(() => {
    return stockEntries.filter(
      (entry) => entry.formato !== "Retalho" && entry.formato !== "Saída"
    );
  }, [stockEntries]);

  // Data no formato aceito pelo DataTable (com isHeader)
  const tableData: RowShape[] = useMemo(
    () => filteredEntries.map((e) => ({ ...e, isHeader: false })),
    [filteredEntries]
  );

  const totals = useMemo(() => {
    return filteredEntries.reduce(
      (acc, entry) => {
        acc.totalChapas += Number(entry.quantidade) || 0;
        acc.totalM2 += Number(String(entry.m2).replace(",", ".")) || 0;
        acc.totalCaixas += Number(entry.quantidadeCaixas) || 0;
        acc.totalValorNF += Number(entry.valorNF) || 0;
        return acc;
      },
      {
        totalChapas: 0,
        totalM2: 0,
        totalCaixas: 0,
        totalValorNF: 0,
      }
    );
  }, [filteredEntries]);

  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    const fixedString = numericValue.toFixed(3);
    return fixedString.replace(".", ",");
  };

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
    [closeModal, openModal, updateStockEntry]
  );

  const handleDeleteEntry = useCallback(
    (id: number) => {
      if (window.confirm("Tem certeza que deseja excluir esta entrada?")) {
        deleteStockEntry(id);
        toast.success("Entrada deletada com sucesso!");
      }
    },
    [deleteStockEntry]
  );

  // ---- Tipar as colunas com RowShape para casar com o DataTable
  const columns = useMemo((): ColumnDef<RowShape>[] => {
    return [
      {
        accessorKey: "codBar",
        header: "Cód. Barras",
        cell: ({ row }) => <div>{row.original.codBar.value}</div>,
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
      {
        accessorKey: "alturaChapa",
        header: "A. Chapa",
        cell: ({ row }) => (
          <div className="text-right">
            {formatDimension(row.original.alturaChapa)}
          </div>
        ),
      },
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
          <div className="text-right">
            {(Number(row.original.valorNF) || 0).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
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
              onClick={() => handleDeleteEntry(Number(row.original.id))}
            />
          </div>
        ),
      },
    ];
  }, [handleDeleteEntry, handleEditEntry]);

  // ---- Render customizado da linha (tipado com RowShape)
  const customRowRender = useCallback((row: Row<RowShape>) => {
    const isEven = row.index % 2 === 0;
    const bgColor = isEven ? "bg-gray-600" : "bg-gray-700";
    const hoverColor = "hover:bg-gray-500";
    return (
      <TableRow
        key={row.id}
        className={`${bgColor} ${hoverColor} text-white text-[10px] border-b-1 border-gray-100`}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className={`px-1 first:pl-2 align-middle text-left text-[10px] break-words`}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  }, []);

  // ---- Mapa por ID da coluna -> conteúdo do rodapé
  const footerByColumnId: Record<string, React.ReactNode> = useMemo(() => {
    if (filteredEntries.length === 0) return {};
    return {
      codBar: <span className="font-bold">Totais:</span>,
      quantidade: totals.totalChapas.toLocaleString("pt-BR"),
      m2: totals.totalM2.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      quantidadeCaixas: totals.totalCaixas.toLocaleString("pt-BR"),
      valorNF: totals.totalValorNF.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    };
  }, [filteredEntries.length, totals]);

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
          <AlertBox text="Movimentações de entrada irão incrementar no estoque geral e no estoque de terceiros." />,
        ]}
        onSearchChange={() => {}}
        searchPlaceholder="Buscar..."
        onFilterClick={() => {}}
        hasActiveFilters={false}
      />

      {/* ATENÇÃO: tipar o DataTable com <RowShape> para casar com as colunas e os dados */}
      <DataTable<RowShape>
        columns={columns}
        data={tableData}
        customRowRender={customRowRender}
        rowCount={tableData.length}
        pagination={pagination}
        sorting={sorting}
        setSorting={setSorting}
        setPagination={setPagination}
        isLoading={false}
        showAllOption
        // Mantém o rodapé alinhado por coluna
        footerByColumnId={footerByColumnId}
      />
    </>
  );
};

export default EntryTable;
