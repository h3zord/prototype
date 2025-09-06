import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTableHeader } from "../../../../components/index";
import { useStockEntry } from "../../entry/components/context/StockEntryContext";

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
}

const ThirdTable = () => {
  const { stockEntries } = useStockEntry();

  // --- FUNÇÃO HELPER ADICIONADA ---
  // Formata uma string com vírgula (ex: "1,2") para 3 casas decimais (ex: "1,200")
  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    const fixedString = numericValue.toFixed(3);
    return fixedString.replace(".", ",");
  };
  // --- FIM DA FUNÇÃO HELPER ---

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
      // --- COLUNA ADICIONADA ---
      {
        accessorKey: "alturaChapa",
        header: "A. Chapa",
        cell: ({ row }) => (
          <div className="text-right">
            {formatDimension(row.original.alturaChapa)}
          </div>
        ),
      },
      // --- COLUNA ADICIONADA ---
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
  }, []); // A função formatDimension é estável e não precisa ser dependência

  return (
    <>
      <DataTableHeader
        actions={[
          <div className="col-span-full bg-yellow-600/20 border border-yellow-600 rounded-lg p-2">
            <h4 className="font-semibold text-yellow-200 text-xs">
              Essa tabela exibirá o saldo dos clientes para cada matéria prima,
              e estará vinculada às ordens de serviço, onde irá ocorrer a
              redução do saldo de acordo com o serviço realizado.
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

export default ThirdTable;
