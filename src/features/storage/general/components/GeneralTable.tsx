import DataTable from "../../../../components/ui/table/data-table/DataTable";
import DateRangePicker from "../../../../features/dashboard/components/Filters/DateRangePicker";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTableHeader } from "../../../../components/index";
import { useStockEntry } from "../../entry/components/context/StockEntryContext";

// Interface para os dados agregados
interface AggregatedEntry {
  id: string;
  codBar: { label: string; value: number };
  fabricante: string;
  modelo: string;
  espessura: string;
  formato: string;
  alturaChapa: string;
  larguraChapa: string;
  unidade: { label: string; value: string };
  totalM2: number;
  totalQuantidadeChapas: number;
}

const GeneralTable = () => {
  const { stockEntries } = useStockEntry();

  const aggregatedData = useMemo(() => {
    const summary = new Map<string, AggregatedEntry>();

    for (const entry of stockEntries) {
      const key = `${entry.codBar.value}-${entry.unidade.value}`;

      // ---- INÍCIO DA CORREÇÃO ----
      // 1. Pega os valores "por caixa"
      const m2PerBox = parseFloat(entry.m2.replace(",", ".")) || 0;
      const platesPerBox = Number(entry.quantidade) || 0;

      // 2. Pega o multiplicador deste lançamento
      const numberOfBoxes = parseInt(entry.quantidadeCaixas, 10) || 0;

      // 3. Calcula os subtotais para este lançamento específico
      const totalM2ForThisEntry = m2PerBox * numberOfBoxes;
      const totalPlatesForThisEntry = platesPerBox * numberOfBoxes;
      // ---- FIM DA CORREÇÃO ----

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
        });
      }

      // 4. Soma os subtotais calculados ao resumo geral
      const currentSummary = summary.get(key)!;
      currentSummary.totalM2 += totalM2ForThisEntry;
      currentSummary.totalQuantidadeChapas += totalPlatesForThisEntry;
    }

    return Array.from(summary.values());
  }, [stockEntries]);

  // A definição das colunas já está correta e não precisa de alterações
  const columns = useMemo(() => {
    const baseColumns: ColumnDef<AggregatedEntry>[] = [
      {
        accessorKey: "codBar",
        header: "Cód. Barras",
        cell: ({ row }) => <div>{row.original.codBar.label}</div>,
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
        accessorKey: "unidade",
        header: "Unidade",
        cell: ({ row }) => <div>{row.original.unidade.label}</div>,
      },
      {
        accessorKey: "totalQuantidadeChapas",
        header: "Total Chapas",
        cell: ({ row }) => (
          <div className="text-right font-bold">
            {row.original.totalQuantidadeChapas}
          </div>
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

export default GeneralTable;
