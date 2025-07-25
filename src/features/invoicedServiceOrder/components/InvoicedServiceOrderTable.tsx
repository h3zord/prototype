import DataTable from "../../../components/ui/table/data-table/DataTable";
import FilterWithDateModal from "../../../features/pcp/modals/filterWithDateModal";
import { useMemo, useState } from "react";
import { DataTableHeader } from "../../../components";
import { useModal } from "../../../hooks/useModal";
import {
  InvoicedServiceOrder,
  ServiceOrderProduct,
  ServiceOrderProductType,
} from "../../../types/models/serviceorder";
import { formatPrice } from "../../../helpers/formatter";
import { useInvoicedServiceOrder } from "../api/hooks";
import { ShowMoreProducts } from "../../../components/ui/table/components/ShowMoreProducts";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import { getProductTypeOptions } from "../../../features/serviceOrder/api/helpers";
import { unitAbbrevOptions } from "../../../helpers/options/customer";
import { UnitWithColor } from "../../../components/ui/badge/UnitWithColor";
import { FaRegFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

import { ItemCodeCell } from "../../../components/ui/badge/ItemCodeCell";
import { TruncatedText } from "../../../components/ui/form/TruncatedText";
import { productTypeAllOptions } from "../../../helpers/options/serviceorder";
import DieCutBlockRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairReplacementPDF";
import DieCutBlockReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockReplacementPDF";
import DieCutBlockRepairPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairPDF";
import DieCutBlockPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockPDF";
import ClicheCorrugatedRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairReplacementPDF";
import ClicheCorrugatedReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedReplacementPDF";
import ClicheCorrugatedRepairPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairPDF";
import ClicheCorrugatedPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedPDF";

const InvoicedServiceOrdersTable = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");

  const getInitialDateFilter = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    );
    return [firstDayOfMonth, lastDayOfMonth];
  };

  const [filters, setFilters] = useState<any>({
    dispatchedDate: getInitialDateFilter(),
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

  const productTypeOptions = productTypeAllOptions.filter(
    (productType) =>
      productType.value !== ServiceOrderProductType.REPLACEMENT &&
      productType.value !== ServiceOrderProductType.TEST,
  );

  const openFilterMenu = () => {
    openModal("filterMenu", FilterWithDateModal, {
      onClose: () => closeModal("filterMenu"),
      setFilters,
      filters,
      productTypeOptions,
    });
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) => {
      if (value === null || value === undefined) return false;

      if (Array.isArray(value)) {
        return value.some((item) => item !== null && item !== undefined);
      }

      return true;
    });
  }, [filters]);

  const { data: invoicedServiceOrders, isLoading } = useInvoicedServiceOrder({
    pagination,
    sorting: sorting[0],
    search,
    filters,
  });

  const { data: allServiceOrdersResult } = useInvoicedServiceOrder({
    pagination: {
      pageIndex: 0,
      pageSize: 99999,
    },
    sorting: sorting[0],
    search,
    filters,
  });

  const totalPrice = allServiceOrdersResult?.data.reduce((acc, curr) => {
    return acc + (curr.totalPrice ?? 0);
  }, 0);

  const clicheCorrugatedTotalPrice =
    Math.round(
      allServiceOrdersResult?.data
        .filter((order) => order.product === "CLICHE_CORRUGATED")
        .reduce((acc, curr) => acc + (curr.totalPrice ?? 0), 0) * 100,
    ) / 100;

  const diecutblockTotalPrice =
    Math.round(
      allServiceOrdersResult?.data
        .filter((order) => order.product === "DIECUTBLOCK")
        .reduce((acc, curr) => acc + (curr.totalPrice ?? 0), 0) * 100,
    ) / 100;

  const metragemCliche =
    Math.round(
      allServiceOrdersResult?.data?.reduce((acc, curr) => {
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
      allServiceOrdersResult?.data?.reduce((acc, curr) => {
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
              {/* <span className="text-xs border border-gray-400 w-fit px-1 rounded">
                v{row.original.version}
              </span> */}
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
      {
        accessorKey: "productType",
        header: "Tipo",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            {getLabelFromValue(
              row.original.productType,
              getProductTypeOptions(row.original.product),
            )}
          </div>
        ),
      },
      {
        accessorKey: "purchaseOrder",
        header: "Ordem de Compra",
        enableSorting: false,
        cell: ({ row }) => {
          return row.original.purchaseOrder ? (
            <button
              className="text-nowrap border rounded px-1 border-gray-400"
              title="Ver Ordem de Compra"
              onClick={() =>
                navigate(`/purchaseOrder?search=${row.original.purchaseOrder}`)
              }
            >
              {row.original.purchaseOrder}
            </button>
          ) : (
            "-"
          );
        },
      },
      {
        accessorKey: "invoiceDetails.nfNumber",
        header: "Número NF",
        enableSorting: false,
        cell: ({ row }) => (
          <button
            className="text-nowrap border rounded px-1 border-gray-400"
            title="Ver Nota Fiscal"
            onClick={() =>
              navigate(
                `/invoices?search=${row.original.invoiceDetails.nfNumber}`,
              )
            }
          >
            {row.original.invoiceDetails.nfNumber}
          </button>
        ),
      },
      {
        accessorKey: "invoiceDetails.serialNumber",
        header: "Série",
        enableSorting: false,
        cell: ({ row }) => {
          const serialNumber = row.original.invoiceDetails.serialNumber;
          if (!serialNumber) return "-";
          // Se termina com "/" (e nada depois), remove a barra
          if (serialNumber.endsWith("/")) {
            return serialNumber.slice(0, -1);
          }
          return serialNumber;
        },
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
        accessorKey: "budget",
        header: "Orçamento",
        enableSorting: false,
        size: 60,
        minSize: 60,
        cell: ({ row }) => {
          return formatPrice({ price: row.original.budget });
        },
      },
      {
        accessorKey: "totalPrice",
        header: "Tabela",
        enableSorting: false,
        cell: ({ row }) => {
          return formatPrice({ price: row.original.totalPrice });
        },
      },
      {
        accessorKey: "invoiceDetails.shippingPrice",
        header: "Frete",
        enableSorting: false,
        cell: ({ row }) => {
          return formatPrice({
            price: row.original.invoiceDetails.shippingPrice,
          });
        },
      },
      // {
      //   accessorKey: "invoiceDetails.otherPrice",
      //   header: "Outros",
      //   enableSorting: false,
      //   cell: ({ row }) => {
      //     return formatPrice({
      //       price: row.original.invoiceDetails.otherPrice,
      //     });
      //   },
      // },
      // {
      //   accessorKey: "invoiceDetails.discount",
      //   header: "Desconto",
      //   enableSorting: false,
      //   cell: ({ row }) => {
      //     return formatPrice({
      //       price: row.original.invoiceDetails.discount,
      //     });
      //   },
      // },
      // {
      //   accessorKey: "transport.fantasyName",
      //   header: "Transporte",
      //   enableSorting: false,
      // },
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
        accessorKey: "invoiceDetails.invoiceDate",
        header: "Faturada",
        enableSorting: false,
        cell: ({ row }) => {
          const date = new Date(row.original.invoiceDetails.billingDate);
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
    ];

    return baseColumns;
  }, []);

  return (
    <>
      <DataTableHeader
        // title="Faturadas"
        onSearchChange={(data) => {
          setSearch(data);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        onFilterClick={openFilterMenu}
        hasActiveFilters={hasActiveFilters}
      />
      <DataTable
        columns={columns}
        data={invoicedServiceOrders?.data ?? []}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        rowCount={invoicedServiceOrders?.totalCount ?? 0}
        isLoading={isLoading}
        totalPrice={totalPrice}
        clicheCorrugatedTotalPrice={clicheCorrugatedTotalPrice}
        diecutblockTotalPrice={diecutblockTotalPrice}
        metragemCliche={metragemCliche}
        metragemForma={metragemForma}
        totalInvoice={0}
        osNumber={allServiceOrdersResult?.data.length}
        // showAllOption={false}
      />
    </>
  );
};

export default InvoicedServiceOrdersTable;
