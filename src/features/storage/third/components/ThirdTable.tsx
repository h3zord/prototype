import React, { useMemo, useCallback } from "react";
import { ColumnDef, Row, flexRender } from "@tanstack/react-table";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { DataTableHeader } from "../../../../components/index";
import { useStockEntry } from "../../entry/context/StockEntryContext";
import { AlertBox } from "../../../../components/components/ui/AlertBox";
import {
  TableCell,
  TableRow,
} from "../../../../components/components/ui/table";

interface AggregatedEntry {
  id: string;
  codBar: { label: string; value: string };
  cliente: { label: string; value: string };
  fabricante: string;
  modelo: string;
  espessura: string;
  formato: string;
  alturaChapa: string;
  larguraChapa: string;
  unidade: { label: string; value: string };
  totalM2: number;
  isFooter?: boolean; // Adicionado para a linha de rodapé
}

const ThirdTable = () => {
  const { stockEntries } = useStockEntry();

  const aggregatedData = useMemo(() => {
    const summary = new Map<string, AggregatedEntry>();
    const stockInputEntries = stockEntries.filter(
      (entry) => entry.formato !== "Retalho" && entry.formato !== "Saída",
    );

    for (const entry of stockInputEntries) {
      const key = `${entry.codBar.value}-${entry.cliente.value}`;
      const altura = parseFloat(entry.alturaChapa.replace(",", ".")) || 0;
      const largura = parseFloat(entry.larguraChapa.replace(",", ".")) || 0;
      const chapas = Number(entry.quantidade) || 0;
      const caixas = Number(entry.quantidadeCaixas) || 0;
      const totalM2ForThisEntry = altura * largura * chapas * caixas;

      if (!summary.has(key)) {
        summary.set(key, {
          id: key,
          codBar: entry.codBar,
          cliente: entry.cliente,
          fabricante: entry.fabricante,
          modelo: entry.modelo,
          espessura: entry.espessura,
          formato: entry.formato,
          alturaChapa: entry.alturaChapa,
          larguraChapa: entry.larguraChapa,
          unidade: entry.unidade,
          totalM2: 0,
        });
      }

      const currentSummary = summary.get(key)!;
      currentSummary.totalM2 += totalM2ForThisEntry;
    }
    return Array.from(summary.values());
  }, [stockEntries]);

  const dataWithFooter = useMemo(() => {
    if (aggregatedData.length === 0) {
      return [];
    }

    const grandTotalM2 = aggregatedData.reduce(
      (acc, entry) => acc + entry.totalM2,
      0,
    );

    const footerRow: AggregatedEntry = {
      id: "footer-totals",
      isFooter: true,
      totalM2: grandTotalM2,
      codBar: { label: "", value: "" },
      cliente: { label: "", value: "" },
      fabricante: "",
      modelo: "",
      espessura: "",
      formato: "",
      alturaChapa: "",
      larguraChapa: "",
      unidade: { label: "", value: "" },
    };

    return [...aggregatedData, footerRow];
  }, [aggregatedData]);

  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    const fixedString = numericValue.toFixed(3);
    return fixedString.replace(".", ",");
  };

  const columns = useMemo((): ColumnDef<AggregatedEntry>[] => {
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
        accessorKey: "espessura",
        header: "Espessura",
        cell: ({ row }) => (
          <div className="text-right">{row.original.espessura}</div>
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
        accessorKey: "totalM2",
        header: "Saldo Total m²",
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.totalM2.toFixed(3).replace(".", ",")}
          </div>
        ),
      },
      {
        accessorKey: "unidade",
        header: "Unidade",
        cell: ({ row }) => (
          <div className="text-right">{row.original.unidade.label}</div>
        ),
      },
    ];
  }, []);

  const customRowRender = useCallback((row: Row<AggregatedEntry>) => {
    if (row.original.isFooter) {
      return (
        <TableRow className="font-bold text-white sticky bottom-0 z-10">
          <TableCell className="bg-gray-800 text-left text-[10px] pl-2 pr-1 py-2">
            Totais:
          </TableCell>
          <TableCell colSpan={7} className="bg-gray-800 py-2"></TableCell>
          <TableCell className="bg-gray-800 text-right text-[10px] px-1 py-2">
            {row.original.totalM2.toFixed(3).replace(".", ",")}
          </TableCell>
          <TableCell colSpan={1} className="bg-gray-800 py-2"></TableCell>
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
          <AlertBox
            text="Essa tabela exibirá o saldo dos clientes para cada matéria prima,
              e estará vinculada às ordens de serviço, onde irá ocorrer a
              redução do saldo de acordo com o serviço realizado."
          />,
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
        rowCount={aggregatedData.length}
        pagination={{
          pageIndex: 0,
          pageSize: 10,
        }}
        setPagination={() => {}}
      />
    </>
  );
};

export default ThirdTable;
