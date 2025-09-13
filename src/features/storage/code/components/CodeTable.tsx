import DataTableHeader from "../../../../components/ui/table/DataTableHeader";
import CodeModal from "./modal/codeModal";
import DataTable from "../../../../components/ui/table/data-table/DataTable";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useModal } from "../../../../hooks/useModal";
import { BiSolidEdit } from "react-icons/bi";
import { PiPlusBold } from "react-icons/pi";
import { BarCodeData, useBarCode } from "../context/CodeContext";
import { Trash } from "lucide-react";
import { IconButton, Button } from "../../../../components/index";
import { toast } from "react-toastify";

const CodeTable = () => {
  const { openModal, closeModal } = useModal();
  const { barCodes, deleteBarCode, addBarCode, updateBarCode } = useBarCode();

  // --- FUNÇÃO HELPER ADICIONADA ---
  // Formata uma string com vírgula (ex: "1,2") para 3 casas decimais (ex: "1,200")
  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    const fixedString = numericValue.toFixed(3);
    return fixedString.replace(".", ",");
  };
  // --- FIM DA FUNÇÃO HELPER ---

  const handleCreateBarCodeClick = () => {
    openModal("createBarCode", CodeModal, {
      onClose: () => closeModal("createBarCode"),
      onSubmit: (data: Omit<BarCodeData, "id">) => {
        addBarCode(data);
      },
    });
  };

  const handleEditBarCode = (barCode: BarCodeData) => {
    openModal("editBarCode", CodeModal, {
      barCode,
      onClose: () => closeModal("editBarCode"),
      onSubmit: () => {}, // Não usado na edição
      onUpdate: (id: number, data: Partial<BarCodeData>) => {
        updateBarCode(id, data);
      },
    });
  };

  const handleDeleteBarCode = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este código de barras?")) {
      deleteBarCode(id);
      toast.success("Código de barras deletado com sucesso!");
    }
  };

  const columns: ColumnDef<BarCodeData>[] = useMemo(() => {
    const baseColumns: ColumnDef<BarCodeData>[] = [
      {
        accessorKey: "codBar",
        header: "Código de Barras",
        cell: ({ row }) => (
          <div className="w-[200px]">{row.original.codBar}</div>
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
      // --- MUDANÇA AQUI ---
      {
        accessorKey: "alturaChapa",
        header: "Altura Chapa",
        cell: ({ row }) => (
          <div className="text-right">
            {formatDimension(row.original.alturaChapa)}
          </div>
        ),
      },
      // --- MUDANÇA AQUI ---
      {
        accessorKey: "larguraChapa",
        header: "Largura Chapa",
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
    ];

    baseColumns.push({
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconButton
            icon={<BiSolidEdit size={18} className="text-white outline-none" />}
            onClick={() => handleEditBarCode(row.original)}
          />
          <IconButton
            icon={<Trash size={18} className="text-white outline-none" />}
            onClick={() => handleDeleteBarCode(row.original.id)}
          />
        </div>
      ),
    });

    return baseColumns;
    // A dependência aqui não precisa incluir 'formatDimension', pois ela é estável
    // dentro do escopo de renderização do componente.
  }, []);

  return (
    <>
      <DataTableHeader
        actions={[
          <div className="flex items-center gap-6" key="actions">
            <Button onClick={handleCreateBarCodeClick}>
              <div className="flex items-center justify-center gap-2">
                <PiPlusBold />
                <span>Cadastrar Código de Barras</span>
              </div>
            </Button>
          </div>,
        ]}
        onSearchChange={() => {}}
        searchPlaceholder="Buscar..."
        onFilterClick={() => {}}
        hasActiveFilters={false}
      />
      <DataTable
        columns={columns}
        data={barCodes}
        rowCount={barCodes.length}
        pagination={{
          pageIndex: 0,
          pageSize: 10,
        }}
        setPagination={() => {}}
      />
    </>
  );
};

export default CodeTable;
