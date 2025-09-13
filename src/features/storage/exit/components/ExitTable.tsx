import React, { useMemo, useCallback } from "react";
import { ColumnDef, Row, flexRender } from "@tanstack/react-table";
import ExitModal from "./modal/ExitModal";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { PiPlusBold } from "react-icons/pi";
import { BiSolidEdit } from "react-icons/bi";
import { Trash } from "lucide-react";
import { AlertBox } from "../../../../components/components/ui/AlertBox";
import { useModal } from "../../../../hooks/useModal";
import {
  DataTableHeader,
  Button,
  IconButton,
} from "../../../../components/index";
import {
  EntryData,
  useStockEntry,
} from "../../entry/context/StockEntryContext";
import {
  TableCell,
  TableRow,
} from "../../../../components/components/ui/table";

const ExitTable = () => {
  const { openModal, closeModal } = useModal();
  const { stockEntries } = useStockEntry();

  const exitData = useMemo(() => {
    return stockEntries.filter((entry) => entry.quantidade < 0);
  }, [stockEntries]);

  // LÓGICA DO RODAPÉ ADICIONADA AQUI
  const dataWithFooter = useMemo(() => {
    if (exitData.length === 0) {
      return [];
    }

    const totals = exitData.reduce(
      (acc, entry) => {
        // Soma a quantidade de chapas (usando o valor absoluto)
        acc.totalChapas += Math.abs(entry.quantidade) || 0;

        // Replica o cálculo de m² usado para cada linha
        const alturaUsada = parseFloat(
          entry.alturaUsada?.replace(",", ".") || "0",
        );
        const larguraUsada = parseFloat(
          entry.larguraUsada?.replace(",", ".") || "0",
        );
        const quantidadeSaida = Math.abs(entry.quantidade) || 0;
        const m2TotalUsado = alturaUsada * larguraUsada * quantidadeSaida;
        acc.totalM2 += m2TotalUsado;

        return acc;
      },
      { totalChapas: 0, totalM2: 0 },
    );

    const footerRow = {
      id: "footer-totals",
      isFooter: true,
      quantidade: totals.totalChapas.toLocaleString("pt-BR"),
      m2: totals.totalM2.toLocaleString("pt-BR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }),
    };

    return [...exitData, footerRow];
  }, [exitData]);

  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    const fixedString = numericValue.toFixed(3);
    return fixedString.replace(".", ",");
  };

  const handleCreateClick = () => {
    openModal("createStorage", ExitModal, {
      onClose: () => closeModal("createStorage"),
    });
  };

  const columns: ColumnDef<EntryData>[] = useMemo(() => {
    return [
      {
        accessorKey: "codBar",
        header: "Código de Barras",
        cell: ({ row }) => <div>{row.original.codBar.value}</div>,
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
        accessorKey: "espessura",
        header: "Espessura",
        cell: ({ row }) => (
          <div className="text-right">{row.original.espessura}</div>
        ),
      },
      {
        accessorKey: "formato",
        header: "Formato",
        cell: ({ row }) => {
          const isRetalho = row.original.formato === "Retalho";
          if (isRetalho) {
            return (
              <div className="text-right">
                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                  {row.original.formato}
                </span>
              </div>
            );
          }
          const altura = row.original.alturaChapa;
          const largura = row.original.larguraChapa;
          return <div className="text-right">{`${altura} x ${largura}`}</div>;
        },
      },
      {
        accessorKey: "alturaUsada",
        header: "A. Chapa (Usado)",
        cell: ({ row }) => (
          <div className="text-right">
            {formatDimension(row.original.alturaUsada || "")}
          </div>
        ),
      },
      {
        accessorKey: "larguraUsada",
        header: "L. Chapa (Usado)",
        cell: ({ row }) => (
          <div className="text-right">
            {formatDimension(row.original.larguraUsada || "")}
          </div>
        ),
      },
      {
        accessorKey: "quantidade",
        header: "Qtd. Chapa (Usado)",
        cell: ({ row }) => (
          <div className="text-right">{Math.abs(row.original.quantidade)}</div>
        ),
      },
      {
        accessorKey: "m2",
        header: "m² (Usado)",
        cell: ({ row }) => {
          const alturaUsada = parseFloat(
            row.original.alturaUsada?.replace(",", ".") || "0",
          );
          const larguraUsada = parseFloat(
            row.original.larguraUsada?.replace(",", ".") || "0",
          );
          const quantidadeSaida = Math.abs(row.original.quantidade) || 0;
          const m2TotalUsado = alturaUsada * larguraUsada * quantidadeSaida;
          return (
            <div className="text-right">
              {m2TotalUsado.toFixed(3).replace(".", ",")}
            </div>
          );
        },
      },
      {
        accessorKey: "apr",
        header: "% Aprov.",
        cell: ({ row }) => (
          <div className="text-right">{row.original.apr}%</div>
        ),
      },
      {
        accessorKey: "unidade",
        header: "Uni",
        cell: ({ row }) => (
          <div className="text-right">{row.original.unidade.label}</div>
        ),
      },
      {
        accessorKey: "entryDate",
        header: "Data Saída",
        cell: ({ row }) => {
          const date = row.original.entryDate;
          if (!date) return "";
          const dateOnly = date.split("T")[0];
          const [year, month, day] = dateOnly.split("-");
          return <div className="text-center">{`${day}/${month}/${year}`}</div>;
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: () => (
          <div className="flex items-center justify-center gap-1">
            <IconButton
              icon={<BiSolidEdit size={18} />}
              onClick={() => alert("Lógica a ser implementada")}
            />
            <IconButton
              icon={<Trash size={18} />}
              onClick={() => alert("Lógica a ser implementada")}
            />
          </div>
        ),
      },
    ];
  }, []);

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
          <TableCell colSpan={4} className="bg-gray-800 py-2"></TableCell>
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
          <div className="flex items-center gap-4" key="header-actions">
            <Button onClick={handleCreateClick}>
              <div className="flex items-center justify-center gap-2">
                <PiPlusBold />
                <span>Cadastrar Saída</span>
              </div>
            </Button>
            <AlertBox text="Movimentações de saída irão reduzir do estoque geral." />
          </div>,
        ]}
        onSearchChange={() => {}}
        searchPlaceholder="Buscar..."
        onFilterClick={() => {}}
        hasActiveFilters={false}
      />
      <DataTable
        columns={columns}
        data={dataWithFooter}
        customRowRender={customRowRender}
        rowCount={exitData.length}
        pagination={{
          pageIndex: 0,
          pageSize: 10,
        }}
        setPagination={() => {}}
      />
    </>
  );
};

export default ExitTable;
