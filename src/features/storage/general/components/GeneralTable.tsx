import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTableHeader } from "../../../../components/index";
import { useStockEntry } from "../../entry/components/context/StockEntryContext";

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
}

const GeneralTable = () => {
  const { stockEntries } = useStockEntry();

  // --- FUNÇÃO HELPER ADICIONADA ---
  // Esta função formata uma string (ex: "1,2") para 3 casas decimais (ex: "1,200")
  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    // 1. Troca vírgula por ponto (ex: "1,2" -> "1.2")
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    // 2. Formata para 3 decimais (ex: 1.2 -> "1.200")
    const fixedString = numericValue.toFixed(3);
    // 3. Troca o ponto de volta para vírgula para exibição
    return fixedString.replace(".", ",");
  };
  // --- FIM DA FUNÇÃO HELPER ---

  const aggregatedData = useMemo(() => {
    const summary = new Map<string, AggregatedEntry>();

    for (const entry of stockEntries) {
      const key =
        entry.formato === "Retalho"
          ? `RETALHO-${entry.codBar.value}-${entry.unidade.value}`
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

      const alturaRealDoGrupo =
        parseFloat(currentSummary.alturaChapa.replace(",", ".")) || 0;
      const larguraRealDoGrupo =
        parseFloat(currentSummary.larguraChapa.replace(",", ".")) || 0;
      const areaPorChapa = alturaRealDoGrupo * larguraRealDoGrupo;

      const m2NestaEntrada = areaPorChapa * chapasNestaEntrada;
      currentSummary.totalM2 += m2NestaEntrada;
    }

    const finalResults = Array.from(summary.values());

    return finalResults.filter((item) => {
      if (item.formato !== "Retalho") {
        return true;
      }
      return item.totalQuantidadeChapas !== 0;
    });
  }, [stockEntries]);

  const columns = useMemo((): ColumnDef<AggregatedEntry>[] => {
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
        cell: ({ row }) => (
          <div className="text-right">
            <span
              className={`px-2 py-1 rounded-full ${
                row.original.formato === "Retalho"
                  ? "bg-yellow-100 text-yellow-800 text-xs"
                  : ""
              }`}
            >
              {row.original.formato}
            </span>
          </div>
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
        accessorKey: "totalQuantidadeChapas",
        header: "Saldo Chapas",
        cell: ({ row }) => (
          <div className="text-right">{row.original.totalQuantidadeChapas}</div>
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
    // A função 'formatDimension' é definida fora do useMemo, mas dentro do escopo do componente,
    // então ela é estável e não precisa ser adicionada como dependência aqui.
    // Se você a definisse FORA do componente, seria ainda mais otimizado, mas assim funciona perfeitamente.
  }, []);

  return (
    <>
      <DataTableHeader
        actions={[
          <div className="col-span-full bg-yellow-600/20 border border-yellow-600 rounded-lg p-2">
            <h4 className="font-semibold text-yellow-200 text-xs">
              Essa tabela exibirá a quantidade de chapas em estoque na empresa,
              agrupadas por código de barras e separadas por unidade.
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
