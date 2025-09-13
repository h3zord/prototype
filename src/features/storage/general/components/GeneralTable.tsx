/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useCallback } from "react";
import { ColumnDef, Row, flexRender } from "@tanstack/react-table";
import {
  TableCell,
  TableRow,
} from "../../../../components/components/ui/table";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { DataTableHeader } from "../../../../components/index";
import { useStockEntry } from "../../entry/context/StockEntryContext";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AlertBox } from "../../../../components/components/ui/AlertBox";

interface AggregatedEntry {
  id: string;
  codBar: { label: string; value: string };
  fabricante: string;
  modelo: string;
  espessura: string;
  formato: string;
  alturaChapa: string;
  larguraChapa: string;
  unidade: { label: string; value: string };
  totalM2: number;
  totalQuantidadeChapas: number;
  originalSheetId?: string;
  isScrap?: boolean;
  parentId?: string;
  children?: AggregatedEntry[];
  level?: number;
  isFooter?: boolean; // Adicionado para a linha de rodapé
}

const GeneralTable = () => {
  const { stockEntries } = useStockEntry();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    const fixedString = numericValue.toFixed(3);
    return fixedString.replace(".", ",");
  };

  const toggleRowExpansion = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  const hierarchicalData = useMemo(() => {
    const summary = new Map<string, AggregatedEntry>();
    const scrapsByOriginalSheet = new Map<string, AggregatedEntry[]>();

    for (const entry of stockEntries) {
      const key = entry.isScrap
        ? `SCRAP-${entry.originalSheetId}-${entry.alturaChapa}-${entry.larguraChapa}-${entry.unidade.value}`
        : `${entry.codBar.value}-${entry.unidade.value}`;

      if (!summary.has(key)) {
        summary.set(key, {
          id: key,
          codBar: entry.codBar,
          fabricante: entry.fabricante,
          modelo: entry.modelo,
          espessura: entry.espessura,
          formato: entry.formato,
          alturaChapa: entry.alturaChapa,
          larguraChapa: entry.larguraChapa,
          unidade: entry.unidade,
          totalM2: 0,
          totalQuantidadeChapas: 0,
          originalSheetId: entry.originalSheetId,
          isScrap: entry.isScrap,
          children: [],
          level: entry.isScrap ? 1 : 0,
        });
      }

      const currentSummary = summary.get(key)!;
      let chapasNestaEntrada = 0;
      if (entry.formato !== "Retalho" && entry.formato !== "Saída") {
        chapasNestaEntrada =
          (Number(entry.quantidade) || 0) *
          (Number(entry.quantidadeCaixas) || 0);
      } else {
        chapasNestaEntrada = Number(entry.quantidade) || 0;
      }
      currentSummary.totalQuantidadeChapas += chapasNestaEntrada;

      const alturaReal =
        parseFloat(currentSummary.alturaChapa.replace(",", ".")) || 0;
      const larguraReal =
        parseFloat(currentSummary.larguraChapa.replace(",", ".")) || 0;
      const areaPorChapa = alturaReal * larguraReal;
      const m2NestaEntrada = areaPorChapa * chapasNestaEntrada;
      currentSummary.totalM2 += m2NestaEntrada;

      if (entry.isScrap && entry.originalSheetId) {
        if (!scrapsByOriginalSheet.has(entry.originalSheetId)) {
          scrapsByOriginalSheet.set(entry.originalSheetId, []);
        }
        const existingScrap = scrapsByOriginalSheet
          .get(entry.originalSheetId)!
          .find((s) => s.id === key);
        if (!existingScrap) {
          scrapsByOriginalSheet
            .get(entry.originalSheetId)!
            .push(currentSummary);
        }
      }
    }

    const allItems = Array.from(summary.values()).filter((item) => {
      if (item.formato !== "Retalho") {
        return true;
      }
      return item.totalQuantidadeChapas !== 0;
    });

    const mainSheets = allItems.filter((item) => !item.isScrap);
    const scraps = allItems.filter((item) => item.isScrap);
    const hierarchicalResult: AggregatedEntry[] = [];

    mainSheets.forEach((sheet) => {
      const sheetWithChildren = { ...sheet, children: [] as AggregatedEntry[] };
      if (sheet.originalSheetId) {
        const relatedScraps = scraps.filter(
          (scrap) => scrap.originalSheetId === sheet.originalSheetId,
        );
        sheetWithChildren.children = relatedScraps;
      }
      hierarchicalResult.push(sheetWithChildren);
    });

    const orphanScraps = scraps.filter(
      (scrap) =>
        !mainSheets.some(
          (sheet) => sheet.originalSheetId === scrap.originalSheetId,
        ),
    );
    hierarchicalResult.push(...orphanScraps);

    return hierarchicalResult;
  }, [stockEntries]);

  const expandedData = useMemo(() => {
    const result: AggregatedEntry[] = [];
    hierarchicalData.forEach((item) => {
      result.push(item);
      if (
        item.children &&
        item.children.length > 0 &&
        expandedRows.has(item.id)
      ) {
        item.children.forEach((child) => {
          result.push({ ...child, level: 1 });
        });
      }
    });
    return result;
  }, [hierarchicalData, expandedRows]);

  const dataWithFooter = useMemo(() => {
    if (expandedData.length === 0) {
      return [];
    }

    const totals = expandedData.reduce(
      (acc, entry) => {
        acc.totalChapas += entry.totalQuantidadeChapas || 0;
        acc.totalM2 += entry.totalM2 || 0;
        return acc;
      },
      { totalChapas: 0, totalM2: 0 },
    );

    const footerRow: AggregatedEntry = {
      id: "footer-totals",
      isFooter: true,
      totalQuantidadeChapas: totals.totalChapas,
      totalM2: totals.totalM2,
      codBar: { label: "", value: "" },
      fabricante: "",
      modelo: "",
      espessura: "",
      formato: "",
      alturaChapa: "",
      larguraChapa: "",
      unidade: { label: "", value: "" },
    };

    return [...expandedData, footerRow];
  }, [expandedData]);

  const expandAll = () => {
    const allParentIds = hierarchicalData
      .filter((item) => item.children && item.children.length > 0)
      .map((item) => item.id);
    setExpandedRows(new Set(allParentIds));
  };

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  const columns = useMemo((): ColumnDef<AggregatedEntry>[] => {
    return [
      {
        accessorKey: "codBar",
        header: "Código de Barras",
        cell: ({ row }) => {
          const item = row.original;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedRows.has(item.id);
          const level = item.level || 0;

          return (
            <div className={`flex items-center ${level > 0 ? "ml-6" : ""}`}>
              {hasChildren && level === 0 && (
                <button
                  onClick={() => toggleRowExpansion(item.id)}
                  className="mr-2 p-1 hover:bg-gray-700 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              <div className="flex items-center">
                {level > 0 && (
                  <span className="text-yellow-400 mr-2 text-xs">↳</span>
                )}
                <span className={level > 0 ? "text-yellow-300" : ""}>
                  {item.codBar.value}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "fabricante",
        header: "Fabricante",
        cell: ({ row }) => (
          <div
            className={`text-right ${
              row.original.level ? "text-yellow-300" : ""
            }`}
          >
            {row.original.fabricante}
          </div>
        ),
      },
      {
        accessorKey: "modelo",
        header: "Modelo",
        cell: ({ row }) => (
          <div
            className={`text-right ${
              row.original.level ? "text-yellow-300" : ""
            }`}
          >
            {row.original.modelo}
          </div>
        ),
      },
      {
        accessorKey: "espessura",
        header: "Espessura",
        cell: ({ row }) => (
          <div
            className={`text-right ${
              row.original.level ? "text-yellow-300" : ""
            }`}
          >
            {row.original.espessura}
          </div>
        ),
      },
      {
        accessorKey: "formato",
        header: "Formato",
        cell: ({ row }) => (
          <div className="text-right">
            <span
              className={`px-2 py-1 rounded-full ${
                row.original.formato === "Retalho" || row.original.isScrap
                  ? "bg-yellow-100 text-yellow-800 text-xs"
                  : ""
              }`}
            >
              {row.original.formato === "Retalho" || row.original.isScrap
                ? "Retalho"
                : row.original.formato}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "alturaChapa",
        header: "A. Chapa",
        cell: ({ row }) => (
          <div
            className={`text-right ${
              row.original.level ? "text-yellow-300" : ""
            }`}
          >
            {formatDimension(row.original.alturaChapa)}
          </div>
        ),
      },
      {
        accessorKey: "larguraChapa",
        header: "L. Chapa",
        cell: ({ row }) => (
          <div
            className={`text-right ${
              row.original.level ? "text-yellow-300" : ""
            }`}
          >
            {formatDimension(row.original.larguraChapa)}
          </div>
        ),
      },
      {
        accessorKey: "totalQuantidadeChapas",
        header: "Saldo Chapas",
        cell: ({ row }) => (
          <div
            className={`text-right ${
              row.original.level ? "text-yellow-300" : ""
            }`}
          >
            {row.original.totalQuantidadeChapas}
          </div>
        ),
      },
      {
        accessorKey: "totalM2",
        header: "Saldo Total m²",
        cell: ({ row }) => (
          <div
            className={`text-right ${
              row.original.level ? "text-yellow-300" : ""
            }`}
          >
            {row.original.totalM2.toFixed(3).replace(".", ",")}
          </div>
        ),
      },
      {
        accessorKey: "unidade",
        header: "Unidade",
        cell: ({ row }) => (
          <div
            className={`text-right ${
              row.original.level ? "text-yellow-300" : ""
            }`}
          >
            {row.original.unidade.label}
          </div>
        ),
      },
    ];
  }, [expandedRows, toggleRowExpansion, formatDimension]);

  const customRowRender = useCallback((row: Row<AggregatedEntry>) => {
    if (row.original.isFooter) {
      return (
        <TableRow className="font-bold text-white sticky bottom-0 z-10">
          <TableCell className="bg-gray-800 text-left text-[10px] pl-2 pr-1 py-2">
            Totais:
          </TableCell>
          <TableCell colSpan={6} className="bg-gray-800 py-2"></TableCell>
          <TableCell className="bg-gray-800 text-right text-[10px] px-1 py-2">
            {row.original.totalQuantidadeChapas.toLocaleString("pt-BR")}
          </TableCell>
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
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              disabled={
                expandedRows.size ===
                hierarchicalData.filter(
                  (item) => item.children && item.children.length > 0,
                ).length
              }
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-600 hover:bg-gray-700 disabled:bg-[#f9a853] disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              ⬇ Expandir Todas
            </button>
            <button
              onClick={collapseAll}
              disabled={expandedRows.size === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-600 hover:bg-gray-700 disabled:bg-[#f9a853] disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              ⬆ Colapsar Todas
            </button>
          </div>,
          <AlertBox
            text=" Essa tabela exibirá a quantidade de chapas em estoque na empresa,
              agrupadas por código de barras e separadas por unidade."
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
        rowCount={expandedData.length}
        pagination={{
          pageIndex: 0,
          pageSize: 20,
        }}
        setPagination={() => {}}
      />
    </>
  );
};

export default GeneralTable;
