import ExitModal from "./modal/ExitModal";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PiPlusBold } from "react-icons/pi";
import {
  DataTableHeader,
  Button,
  IconButton,
} from "../../../../components/index";
import { useModal } from "../../../../hooks/useModal";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { useForm } from "react-hook-form";

// Importações do nosso contexto de estoque
import {
  EntryData,
  useStockEntry,
} from "../../entry/components/context/StockEntryContext";
import { BiSolidEdit } from "react-icons/bi";
import { Trash } from "lucide-react";

const ExitTable = () => {
  const { openModal, closeModal } = useModal();
  const { stockEntries } = useStockEntry();

  // Helper de formatação de dimensão
  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    const fixedString = numericValue.toFixed(3);
    return fixedString.replace(".", ",");
  };

  // Filtra apenas as transações de saída (quantidade negativa)
  const exitData = useMemo(() => {
    return stockEntries.filter((entry) => entry.quantidade < 0);
  }, [stockEntries]);

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
                <span
                  className={`px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs`}
                >
                  {row.original.formato}
                </span>
              </div>
            );
          }

          // Exibe as dimensões REAIS da chapa que foi consumida
          const altura = row.original.alturaChapa;
          const largura = row.original.larguraChapa;
          return <div className="text-right">{`${altura} x ${largura}`}</div>;
        },
      },
      {
        accessorKey: "alturaUsada", // Campo que salvamos no Modal
        header: "A. Chapa (Usado)",
        cell: ({ row }) => (
          <div className="text-right">
            {formatDimension(row.original.alturaUsada || "")}
          </div>
        ),
      },
      {
        accessorKey: "larguraUsada", // Campo que salvamos no Modal
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

      // --- MUDANÇA PRINCIPAL AQUI ---
      {
        accessorKey: "m2", // Mantemos o accessorKey, mas não usamos o valor direto
        header: "m² (Usado)", // Renomeado o header
        cell: ({ row }) => {
          // 1. Calcula o M² com base nas dimensões USADAS salvas na transação
          const alturaUsada = parseFloat(
            row.original.alturaUsada?.replace(",", ".") || "0",
          );
          const larguraUsada = parseFloat(
            row.original.larguraUsada?.replace(",", ".") || "0",
          );

          // 2. Pega a quantidade (positiva) de peças que saíram
          const quantidadeSaida = Math.abs(row.original.quantidade) || 0;

          // 3. Calcula o total de M² efetivamente USADO nessa transação
          const m2TotalUsado = alturaUsada * larguraUsada * quantidadeSaida;

          return (
            <div className="text-right">
              {m2TotalUsado.toFixed(3).replace(".", ",")}
            </div>
          );
        },
      },
      // --- FIM DA MUDANÇA ---

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
  }, []); // formatDimension é estável

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
            <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-2">
              <h4 className="font-semibold text-yellow-200 text-xs">
                Movimentações de saída irão reduzir do estoque geral.
              </h4>
            </div>
          </div>,
        ]}
        onSearchChange={() => {}}
        searchPlaceholder="Buscar..."
        onFilterClick={() => {}}
        hasActiveFilters={false}
      />
      <DataTable
        columns={columns}
        data={exitData}
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
