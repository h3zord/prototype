import DataTable from "../../../../components/ui/table/data-table/DataTable";
import DateRangePicker from "../../../../features/dashboard/components/Filters/DateRangePicker";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useModal } from "../../../../hooks/useModal";
import { PiPlusBold } from "react-icons/pi";
import { DataTableHeader, Button } from "../../../../components/index";
import EntryModal from "../../entry/components/modal/EntryModal";
import {
  EntryData,
  useStockEntry,
} from "../../entry/components/context/StockEntryContext";

// Interface para os dados agregados
interface AggregatedEntry {
  id: number;
  codBar: { label: string; value: number };
  cliente: { label: string; value: string };
  fabricante: string;
  modelo: string;
  espessura: string;
  formato: string;
  alturaChapa: string;
  larguraChapa: string;
  unidade: { label: string; value: string };
  totalM2: number;
}

const ThirdTable = () => {
  const { stockEntries } = useStockEntry();

  const aggregatedData = useMemo(() => {
    const summary = new Map<number, AggregatedEntry>();

    for (const entry of stockEntries) {
      const key = entry.codBar.value;

      // ---- A CORREÇÃO ESTÁ AQUI ----
      // 1. Pega o m² de uma caixa (que já é o total de chapas daquela caixa)
      const m2PerBox = parseFloat(entry.m2.replace(",", ".")) || 0;
      // 2. Pega a quantidade de caixas daquele lançamento
      const numberOfBoxes = parseInt(entry.quantidadeCaixas, 10) || 0;
      // 3. Calcula o subtotal de m² para ESTE lançamento
      const totalM2ForThisEntry = m2PerBox * numberOfBoxes;
      // ---- FIM DA CORREÇÃO ----

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
      // 4. Soma o subtotal calculado ao saldo geral
      currentSummary.totalM2 += totalM2ForThisEntry;
    }

    return Array.from(summary.values());
  }, [stockEntries]);

  const columns = useMemo(() => {
    const baseColumns: ColumnDef<AggregatedEntry>[] = [
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
        cell: ({ row }) => (
          <div className="text-right">{row.original.formato}</div>
        ),
      },
      {
        accessorKey: "alturaChapa",
        header: "A. Chapa",
        cell: ({ row }) => (
          <div className="text-right">{row.original.alturaChapa}</div>
        ),
      },
      {
        accessorKey: "larguraChapa",
        header: "L. Chapa",
        cell: ({ row }) => (
          <div className="text-right">{row.original.larguraChapa}</div>
        ),
      },
      {
        accessorKey: "totalM2",
        header: "Saldo Total m²",
        cell: ({ row }) => (
          <div className="text-right font-bold">
            {row.original.totalM2.toFixed(3).replace(".", ",")}
          </div>
        ),
      },
      {
        accessorKey: "unidade",
        header: "Unidade",
        cell: ({ row }) => <div>{row.original.unidade.label}</div>,
      },
    ];

    return baseColumns;
  }, []);

  return (
    <>
      <DataTableHeader
        actions={[
          <div className="flex items-center gap-6">
            <DateRangePicker />
          </div>,
        ]}
      />
      <DataTable
        columns={columns}
        data={aggregatedData}
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
