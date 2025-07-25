import DataTable from "../../../components/ui/table/data-table/DataTable";
import FilterWithDateModal from "../../../features/pcp/modals/filterWithDateModal";
import { useMemo, useState } from "react";
import { DataTableHeader } from "../../../components";
import { useModal } from "../../../hooks/useModal";
import {
  InvoicedServiceOrder,
  ServiceOrderProduct,
} from "../../../types/models/serviceorder";
import { formatPrice } from "../../../helpers/formatter";
import { useReplacements } from "../api/hooks";
import { ShowMoreProducts } from "../../../components/ui/table/components/ShowMoreProducts";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import { getProductTypeOptions } from "../../../features/serviceOrder/api/helpers";
import { unitAbbrevOptions } from "../../../helpers/options/customer";
import { UnitWithColor } from "../../../components/ui/badge/UnitWithColor";
import { FaRegFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { ItemCodeCell } from "../../../components/ui/badge/ItemCodeCell";
import { useNavigate } from "react-router-dom";
import MoreActionsMenu from "../../../components/ui/table/components/MoreActionsMenu";
import { BiSolidEdit } from "react-icons/bi";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";
import { ServiceOrderStatus } from "../../../types/models/serviceorder";
import { TruncatedText } from "../../../components/ui/form/TruncatedText";
import DieCutBlockRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairReplacementPDF";
import DieCutBlockReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockReplacementPDF";
import DieCutBlockRepairPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairPDF";
import DieCutBlockPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockPDF";
import ClicheCorrugatedRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairReplacementPDF";
import ClicheCorrugatedReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedReplacementPDF";
import ClicheCorrugatedRepairPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairPDF";
import ClicheCorrugatedPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedPDF";

const ReplacementsTable = () => {
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();
  const { permissions } = usePermission();

  const handleEditClick = (serviceOrder: any) => {
    navigate(`/serviceorder/${serviceOrder.id}/edit`, {
      state: { serviceOrder, from: "/replacements" },
    });
  };

  const [filters, setFilters] = useState<any>({
    productType: "REPLACEMENT", // Filtro fixo para reposições
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);

  const { openModal, closeModal } = useModal();

  const openFilterMenu = () => {
    openModal("filterMenu", FilterWithDateModal, {
      onClose: () => closeModal("filterMenu"),
      setFilters,
      filters,
      isReplacementMenu: true,
    });
  };

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some((key) => {
      const value = filters[key];
      if (key === "productType" && value === "REPLACEMENT") return false; // Ignora o filtro fixo
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) {
        return value.some((item) => item !== null && item !== undefined);
      }
      return true;
    });
  }, [filters]);

  const { data: replacements, isLoading } = useReplacements({
    pagination,
    sorting: sorting[0],
    search,
    filters,
    statuses: [ServiceOrderStatus.FINALIZED, ServiceOrderStatus.DISPATCHED],
  });

  console.log("replacements", replacements);

  const { data: allReplacementsResult } = useReplacements({
    pagination: {
      pageIndex: 0,
      pageSize: 99999,
    },
    sorting: sorting[0],
    search,
    filters,
    statuses: [ServiceOrderStatus.FINALIZED, ServiceOrderStatus.DISPATCHED],
  });

  const totalPrice =
    allReplacementsResult?.data.reduce((acc, curr) => {
      return acc + (curr.totalPrice ?? 0);
    }, 0) * -1; // Negativo para representar prejuízo

  const clicheCorrugatedTotalPrice =
    (Math.round(
      allReplacementsResult?.data
        .filter((order) => order.product === "CLICHE_CORRUGATED")
        .reduce((acc, curr) => acc + (curr.totalPrice ?? 0), 0) * 100,
    ) /
      100) *
    -1; // Negativo

  const diecutblockTotalPrice =
    (Math.round(
      allReplacementsResult?.data
        .filter((order) => order.product === "DIECUTBLOCK")
        .reduce((acc, curr) => acc + (curr.totalPrice ?? 0), 0) * 100,
    ) /
      100) *
    -1; // Negativo

  const metragemCliche =
    Math.round(
      allReplacementsResult?.data?.reduce((acc, curr) => {
        if (
          curr.product === "CLICHE_CORRUGATED" &&
          curr.productType !== "REPAIR"
        ) {
          const clicheMetragem =
            curr.printerDetails?.corrugatedPrinterDetails?.measures
              ?.totalMeasuresCliche || 0;
          return acc + clicheMetragem / 10000;
        }
        return acc;
      }, 0) * 100,
    ) / 100;

  const metragemForma =
    Math.round(
      allReplacementsResult?.data?.reduce((acc, curr) => {
        if (curr.product === "DIECUTBLOCK") {
          const totalMeasuresImported =
            curr.dieCutBlockDetails?.measures?.totalMeasuresImported || 0;
          const totalMeasuresNational =
            curr.dieCutBlockDetails?.measures?.totalMeasuresNational || 0;
          const totalLinearMetersChannel =
            curr.dieCutBlockDetails?.measures?.totalLinearMetersChannel || 0;

          return (
            acc +
            (totalLinearMetersChannel +
              totalMeasuresImported +
              totalMeasuresNational)
          );
        }
        return acc;
      }, 0) * 100,
    ) / 100;

  const formatMetrics = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(value);
  };

  const handleShowPDFClick = (serviceOrder: any) => {
    const { product, productType, replacementProductType } = serviceOrder;

    const pdfMap = {
      [ServiceOrderProduct.DIECUTBLOCK]: {
        REPLACEMENT: {
          REPAIR: DieCutBlockRepairReplacementPDF,
          DEFAULT: DieCutBlockReplacementPDF,
        },
        REPAIR: DieCutBlockRepairPDF,
        DEFAULT: DieCutBlockPDF,
      },
      [ServiceOrderProduct.CLICHE_CORRUGATED]: {
        REPLACEMENT: {
          REPAIR: ClicheCorrugatedRepairReplacementPDF,
          DEFAULT: ClicheCorrugatedReplacementPDF,
        },
        REPAIR: ClicheCorrugatedRepairPDF,
        DEFAULT: ClicheCorrugatedPDF,
      },
    };

    const productMap = pdfMap[product];

    let PDFModal;

    if (productMap) {
      if (productType === "REPLACEMENT") {
        PDFModal =
          productMap.REPLACEMENT[replacementProductType] ||
          productMap.REPLACEMENT.DEFAULT;
      } else {
        PDFModal = productMap[productType] || productMap.DEFAULT;
      }
    }

    if (PDFModal) {
      openModal("showServiceOrderPDF", PDFModal, {
        selectedServiceOrder: serviceOrder,
        onClose: () => closeModal("showServiceOrderPDF"),
      });
    } else {
      console.warn("No PDF modal found for this service order:", serviceOrder);
    }
  };

  const handleExportToExcel = () => {
    if (
      !allReplacementsResult?.data ||
      allReplacementsResult.data.length === 0
    ) {
      alert("Nenhum dado disponível para exportação");
      return;
    }

    const exportData = allReplacementsResult.data.map((item) => {
      let metragem = "-";
      if (
        item.product === "CLICHE_CORRUGATED" &&
        item.productType !== "REPAIR"
      ) {
        const clicheMetragem =
          item.printerDetails?.corrugatedPrinterDetails?.measures
            ?.totalMeasuresCliche || 0;
        metragem = `${formatMetrics(clicheMetragem / 10000)} m²`;
      } else if (item.product === "DIECUTBLOCK") {
        const totalMeasuresImported =
          item.dieCutBlockDetails?.measures?.totalMeasuresImported || 0;
        const totalMeasuresNational =
          item.dieCutBlockDetails?.measures?.totalMeasuresNational || 0;
        const totalLinearMetersChannel =
          item.dieCutBlockDetails?.measures?.totalLinearMetersChannel || 0;
        metragem = `${formatMetrics(totalLinearMetersChannel + totalMeasuresImported + totalMeasuresNational)} m`;
      }

      return {
        OS: `${getLabelFromValue(item.unit, unitAbbrevOptions) || ""} ${item.identificationNumber}`,
        Cliente: item.customer?.fantasyName || "",
        Título: item.title || "",
        Subtítulo: item.subTitle || "",
        Produto: item.product || "",
        "Tipo de reposição":
          getLabelFromValue(
            item.replacementProductType,
            getProductTypeOptions(item.product),
          ) || "",
        Metragem: metragem,
        "Valor do Prejuízo": item.totalPrice
          ? new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.totalPrice)
          : "R$ 0,00",
        Frete: item.invoiceDetails?.shippingPrice
          ? new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.invoiceDetails.shippingPrice)
          : "R$ 0,00",
        Operador:
          `${item.operator?.firstName || ""} ${item.operator?.lastName || ""}`.trim(),
        Transporte: item.transport?.fantasyName || "",
        Unidade: getLabelFromValue(item.unit, unitAbbrevOptions) || "",
        Despachada: item.dispatchedDate
          ? new Date(item.dispatchedDate).toLocaleDateString("pt-BR")
          : "",
      };
    });

    const totalsRow = {
      OS: "TOTAIS",
      Cliente: "",
      Título: "",
      Subtítulo: "",
      Produto: "",
      "Tipo de reposição": "",
      Metragem: `Clichê: ${formatMetrics(metragemCliche)} m² | Forma: ${formatMetrics(metragemForma)} m`,
      "Valor do Prejuízo": new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Math.abs(totalPrice)),
      Frete: "",
      Operador: "",
      Transporte: "",
      Unidade: "",
      Despachada: `Total de OS: ${allReplacementsResult.data.length}`,
    };

    const finalData = [...exportData, totalsRow];

    const ws = XLSX.utils.json_to_sheet(finalData);
    const wb = XLSX.utils.book_new();

    const colWidths = [
      { wch: 15 }, // OS
      { wch: 30 }, // Cliente
      { wch: 25 }, // Título
      { wch: 25 }, // Subtítulo
      { wch: 20 }, // Produto
      { wch: 25 }, // Tipo de reposição
      { wch: 15 }, // Metragem
      { wch: 18 }, // Valor do Prejuízo
      { wch: 15 }, // Frete
      { wch: 20 }, // Operador
      { wch: 20 }, // Transporte
      { wch: 12 }, // Unidade
      { wch: 15 }, // Despachada
    ];

    ws["!cols"] = colWidths;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Reposições");

    // Gerar nome do arquivo com data atual
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
    const fileName = `reposicoes_${dateStr}.xlsx`;

    // Fazer download do arquivo
    XLSX.writeFile(wb, fileName);
  };

  const columns: ColumnDef<InvoicedServiceOrder>[] = useMemo(() => {
    const baseColumns: ColumnDef<InvoicedServiceOrder>[] = [
      {
        accessorKey: "identificationNumber",
        header: "OS",
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex gap-1 items-center">
              <UnitWithColor unit={row.original.unit} />
              {row.original.identificationNumber}
            </div>
          );
        },
      },
      {
        header: "Item",
        enableSorting: false,
        cell: ({ row }) => <ItemCodeCell serviceOrder={row.original} />,
      },
      {
        accessorKey: "customer.fantasyName",
        header: "Cliente",
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: "Título",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-[10px]">
            {TruncatedText({ text: row.original.title })}
          </div>
        ),
      },
      {
        accessorKey: "subTitle",
        header: "Subtítulo",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-[10px]">
            {TruncatedText({ text: row.original.subTitle })}
          </div>
        ),
      },
      {
        accessorKey: "product",
        header: "Produto",
        enableSorting: false,
        cell: ({ row }) => {
          return <ShowMoreProducts serviceOrder={row.original} />;
        },
      },

      // {
      //   accessorKey: "productType",
      //   header: "Tipo de produto",
      //   enableSorting: false,
      //   cell: ({ row }) => (
      //     <div className="max-w-[180px]">
      //       {getLabelFromValue(
      //         row.original.productType,
      //         getProductTypeOptions(row.original.product)
      //       )}
      //     </div>
      //   ),
      // },

      {
        accessorKey: "replacementProductType",
        header: "Tipo de reposição",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            {getLabelFromValue(
              row.original.replacementProductType,
              getProductTypeOptions(row.original.product),
            )}
          </div>
        ),
      },
      {
        id: "metragem",
        header: "Metragem",
        enableSorting: false,
        minSize: 110,
        size: 110,
        cell: ({ row }) => {
          if (row.original.product === "CLICHE_CORRUGATED") {
            if (row.original.productType === "REPAIR") {
              return "-";
            }

            return `${formatMetrics(row.original.printerDetails.corrugatedPrinterDetails.measures.totalMeasuresCliche / 10000)} m²`;
          }

          if (row.original.product === "DIECUTBLOCK") {
            const totalMeasuresImported =
              row.original.dieCutBlockDetails.measures.totalMeasuresImported;
            const totalMeasuresNational =
              row.original.dieCutBlockDetails.measures.totalMeasuresNational;
            const totalLinearMetersChannel =
              row.original.dieCutBlockDetails.measures.totalLinearMetersChannel;
            return `${formatMetrics(totalLinearMetersChannel + totalMeasuresImported + totalMeasuresNational)} m`;
          }
        },
      },
      {
        accessorKey: "totalPrice",
        header: "Valor do Prejuízo",
        enableSorting: false,
        cell: ({ row }) => {
          return formatPrice({ price: row.original.totalPrice });
        },
      },
      // {
      //   accessorKey: "invoiceDetails.shippingPrice",
      //   header: "Frete",
      //   enableSorting: false,
      //   cell: ({ row }) => {
      //     const shippingPrice = row.original.invoiceDetails?.shippingPrice;
      //     return formatPrice({
      //       price: shippingPrice,
      //     });
      //   },
      // },
      {
        accessorKey: "operator.firstName",
        header: "Operador",
        enableSorting: false,
        cell: ({ row }) =>
          `${row.original.operator.firstName} ${row.original.operator.lastName}`,
      },
      // {
      //   accessorKey: "transport.fantasyName",
      //   header: "Transporte",
      //   enableSorting: false,
      // },
      {
        accessorKey: "replacementResponsible",
        header: "Responsável",
        enableSorting: false,
        cell: ({ row }) => {
          const responsibles = row.original.replacementResponsibles;

          if (responsibles && responsibles.length > 0) {
            const fullNames = responsibles.map(
              (responsible) =>
                `${responsible.firstName} ${responsible.lastName}`,
            );

            return (
              <div
                className="max-w-[200px] truncate"
                title={fullNames.join(", ")}
              >
                {fullNames.join(", ")}
              </div>
            );
          }

          return "-";
        },
      },
      {
        accessorKey: "reasonReplacement",
        header: "Motivo",
        enableSorting: false,
        cell: ({ row }) => {
          if (
            row.original.reasonReplacement &&
            row.original.reasonReplacement.length > 0
          ) {
            return (
              <div
                className="max-w-[200px] truncate"
                title={row.original.reasonReplacement.join(", ")}
              >
                {row.original.reasonReplacement.join(", ")}
              </div>
            );
          }
          return "-";
        },
      },
      {
        accessorKey: "unit",
        header: "Unidade",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.unit
            ? getLabelFromValue(row.original.unit, unitAbbrevOptions)
            : "-",
      },
      {
        accessorKey: "dispatchedDate",
        header: "Despachada",
        cell: ({ row }) => {
          const date = new Date(row.original.dispatchedDate);
          return date.toLocaleDateString("pt-BR");
        },
      },
      {
        header: "PDF",
        cell: ({ row }) => (
          <button
            onClick={() => handleShowPDFClick(row.original)}
            title="Ver PDF"
            className="ml-2"
          >
            <FaRegFilePdf size={16} />
          </button>
        ),
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const actions = [];

          if (permissions.includes(PERMISSIONS_TYPE.UPDATE_SERVICE_ORDER)) {
            actions.push({
              label: (
                <div className="flex gap-2 items-center">
                  <BiSolidEdit />
                  <div>Editar</div>
                </div>
              ),
              onClick: () => handleEditClick(row.original),
            });
          }

          return (
            <div className="flex items-center justify-center">
              <MoreActionsMenu actions={actions} />
            </div>
          );
        },
      },
    ];

    return baseColumns;
  }, [permissions]);

  return (
    <>
      <DataTableHeader
        // title="Reposições"
        onSearchChange={(data) => {
          setSearch(data);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        onFilterClick={openFilterMenu}
        hasActiveFilters={hasActiveFilters}
        onExportClick={handleExportToExcel}
        exportLabel="Exportar para Excel"
      />
      <DataTable
        columns={columns}
        data={replacements?.data ?? []}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        rowCount={replacements?.totalCount ?? 0}
        isLoading={isLoading}
        totalPrice={totalPrice}
        clicheCorrugatedTotalPrice={clicheCorrugatedTotalPrice}
        diecutblockTotalPrice={diecutblockTotalPrice}
        metragemCliche={metragemCliche}
        metragemForma={metragemForma}
        totalInvoice={0}
        osNumber={allReplacementsResult?.data.length}
      />
    </>
  );
};

export default ReplacementsTable;
