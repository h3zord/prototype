import React, { useMemo, useCallback, useState } from "react";
import { ColumnDef, Row, flexRender } from "@tanstack/react-table";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { BiSolidEdit } from "react-icons/bi";
import { useModal } from "../../../../hooks/useModal";
import { Trash, CheckCircle } from "lucide-react";
import { useStockEntry } from "../../entry/context/StockEntryContext";
import { PiPlusBold } from "react-icons/pi";
import { toast } from "react-toastify";
import { PreEntryData, usePreEntry } from "../context/PreEntryContext";
import { AlertBox } from "../../../../components/components/ui/AlertBox";
import {
  IconButton,
  DataTableHeader,
  Button,
} from "../../../../components/index";
import PreEntryModal from "./modal/PreEntryModal";
import StatusFilterTabs from "./StatusFilterTabs"; // Ajuste o caminho se necessário
import {
  TableCell,
  TableRow,
} from "../../../../components/components/ui/table";

const PreEntryTable = () => {
  const { openModal, closeModal } = useModal();
  const {
    preEntries,
    addPreEntry,
    updatePreEntry,
    deletePreEntry,
    approvePreEntry,
  } = usePreEntry();

  const { addStockEntry } = useStockEntry();

  // Estado para controlar o filtro de status selecionado
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved"
  >("all");

  // Filtra as entradas com base na aba selecionada
  const filteredPreEntries = useMemo(() => {
    if (statusFilter === "all") {
      return preEntries;
    }
    return preEntries.filter((entry) => entry.status === statusFilter);
  }, [preEntries, statusFilter]);

  // Calcula os totais e adiciona a linha de rodapé com base nos dados JÁ FILTRADOS
  const dataWithFooter = useMemo(() => {
    if (filteredPreEntries.length === 0) {
      return [];
    }

    const totals = filteredPreEntries.reduce(
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
      },
    );

    const footerRow = {
      id: "footer-totals",
      isFooter: true,
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

    return [...filteredPreEntries, footerRow];
  }, [filteredPreEntries]);

  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    const fixedString = numericValue.toFixed(3);
    return fixedString.replace(".", ",");
  };

  const handleCreateClick = () => {
    openModal("createPreEntry", PreEntryModal, {
      mode: "create",
      onClose: () => closeModal("createPreEntry"),
      onSubmit: (data: Omit<PreEntryData, "id" | "status">) => {
        addPreEntry(data);
        closeModal("createPreEntry");
      },
    });
  };

  const handleEditEntry = useCallback(
    (entry: PreEntryData) => {
      if (entry.status === "approved") {
        toast.warning("Não é possível editar uma pré-entrada já aprovada!");
        return;
      }
      openModal("editPreEntry", PreEntryModal, {
        mode: "edit",
        entryToEdit: entry,
        onClose: () => closeModal("editPreEntry"),
        onUpdate: (id: number, data: Partial<PreEntryData>) => {
          updatePreEntry(id, data);
          closeModal("editPreEntry");
        },
      });
    },
    [closeModal, openModal, updatePreEntry],
  );

  const handleDeleteEntry = useCallback(
    (entry: PreEntryData) => {
      if (entry.status === "approved") {
        toast.warning("Não é possível excluir uma pré-entrada já aprovada!");
        return;
      }
      if (window.confirm("Tem certeza que deseja excluir esta pré-entrada?")) {
        deletePreEntry(entry.id);
        toast.success("Pré-entrada deletada com sucesso!");
      }
    },
    [deletePreEntry],
  );

  const handleApprovalClick = useCallback(
    (entry: PreEntryData) => {
      if (entry.status === "approved") {
        toast.info("Esta pré-entrada já foi aprovada!");
        return;
      }
      openModal("approvePreEntry", PreEntryModal, {
        entryToEdit: entry,
        mode: "approve",
        onClose: () => closeModal("approvePreEntry"),
        onApprove: (entryData: any) => {
          approvePreEntry(entry.id);
          addStockEntry(entryData);
          closeModal("approvePreEntry");
        },
      });
    },
    [closeModal, openModal, approvePreEntry, addStockEntry],
  );

  const columns = useMemo((): ColumnDef<PreEntryData>[] => {
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
        accessorKey: "purchaseDate",
        header: "Data Compra",
        cell: ({ row }) => {
          const date = row.original.purchaseDate;
          if (!date) return <div className="text-right"></div>;
          const dateOnly = date.split("T")[0];
          const [year, month, day] = dateOnly.split("-");
          return <div className="text-right">{`${day}/${month}/${year}`}</div>;
        },
      },
      {
        accessorKey: "expectedArrivalDate",
        header: "Data Recebimento",
        cell: ({ row }) => {
          const date = row.original.expectedArrivalDate;
          if (!date) return <div className="text-right"></div>;
          const dateOnly = date.split("T")[0];
          const [year, month, day] = dateOnly.split("-");
          return <div className="text-right">{`${day}/${month}/${year}`}</div>;
        },
      },
      {
        accessorKey: "unidade",
        header: "Unidade",
        cell: ({ row }) => (
          <div className="text-right">{row.original.unidade.label}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.status === "approved" ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-200 border border-green-600">
                <CheckCircle size={12} className="mr-1" />
                Aprovado
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-600/20 text-yellow-200 border border-yellow-600">
                Pendente
              </span>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            <IconButton
              icon={<BiSolidEdit size={18} />}
              onClick={() => handleEditEntry(row.original)}
              disabled={row.original.status === "approved"}
              title={
                row.original.status === "approved"
                  ? "Não é possível editar entrada aprovada"
                  : "Editar"
              }
            />
            <IconButton
              icon={<CheckCircle size={18} />}
              onClick={() => handleApprovalClick(row.original)}
              disabled={row.original.status === "approved"}
              title={
                row.original.status === "approved"
                  ? "Já aprovado"
                  : "Confirmar recebimento"
              }
              // className={
              //   row.original.status === "pending"
              //     ? "text-green-400 hover:text-green-300"
              //     : ""
              // }
            />
            <IconButton
              icon={<Trash size={18} />}
              onClick={() => handleDeleteEntry(row.original)}
              disabled={row.original.status === "approved"}
              title={
                row.original.status === "approved"
                  ? "Não é possível excluir entrada aprovada"
                  : "Excluir"
              }
            />
          </div>
        ),
      },
    ];
  }, [handleDeleteEntry, handleEditEntry, handleApprovalClick]);

  const customRowRender = useCallback((row: Row<any>) => {
    if (row.original.isFooter) {
      return (
        <TableRow className="font-bold text-white sticky bottom-0 z-10">
          <TableCell className="bg-gray-800 text-left text-[10px] pl-2 pr-1 py-2">
            Totais:
          </TableCell>
          <TableCell colSpan={6} className="bg-gray-800 py-2"></TableCell>
          <TableCell className="bg-gray-800 text-right text-[10px] px-1 py-2">
            {row.original.quantidade}
          </TableCell>
          <TableCell className="bg-gray-800 text-right text-[10px] px-1 py-2">
            {row.original.m2}
          </TableCell>
          <TableCell className="bg-gray-800 text-right text-[10px] px-1 py-2">
            {row.original.quantidadeCaixas}
          </TableCell>
          <TableCell className="bg-gray-800 py-2"></TableCell>
          <TableCell className="bg-gray-800 text-right text-[10px] px-1 py-2">
            {row.original.valorNF}
          </TableCell>
          <TableCell colSpan={6} className="bg-gray-800 py-2"></TableCell>
        </TableRow>
      );
    }

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

  return (
    <>
      <DataTableHeader
        actions={[
          <div className="flex items-center gap-4" key="actions">
            <Button onClick={handleCreateClick}>
              <div className="flex items-center justify-center gap-2">
                <PiPlusBold />
                <span>Cadastrar Pré-entrada</span>
              </div>
            </Button>
            <StatusFilterTabs
              currentFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />
            <AlertBox text="Pré-entradas são cadastros antecipados. O material só entra no estoque após a confirmação do recebimento." />
          </div>,
        ]}
        onSearchChange={() => {}}
        searchPlaceholder="Buscar..."
        onFilterClick={() => {}}
        hasActiveFilters={false}
      ></DataTableHeader>
      <DataTable
        columns={columns}
        data={dataWithFooter}
        customRowRender={customRowRender}
        rowCount={filteredPreEntries.length}
        pagination={{
          pageIndex: 0,
          pageSize: 10,
        }}
        setPagination={() => {}}
      />
    </>
  );
};

export default PreEntryTable;
