import DataTable from "../../../components/ui/table/data-table/DataTable";
import ShowMoreServiceOrders from "./showMoreServiceOrders";
import { useEffect, useMemo, useState } from "react";
import { DataTableHeader } from "../../../components";
import { usePurchaseOrders } from "../api/hooks";
import { PurchaseOrder } from "../../../types/models/purchaseOrder";
import { useSearchParams } from "react-router-dom";
import { useModal } from "../../../hooks/useModal";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import ShowMoreInvoices from "./showMoreInvoices";
import { ServiceOrderProduct } from "../../../types/models/serviceorder";
import DieCutBlockRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairReplacementPDF";
import DieCutBlockReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockReplacementPDF";
import DieCutBlockRepairPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairPDF";
import DieCutBlockPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockPDF";
import ClicheCorrugatedRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairReplacementPDF";
import ClicheCorrugatedReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedReplacementPDF";
import ClicheCorrugatedRepairPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairPDF";
import ClicheCorrugatedPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedPDF";

const PurchaseOrdersTable = () => {
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const searchQuerie = searchParams.get("search");

    if (searchQuerie) {
      setSearch(searchQuerie);
    }
  }, [searchParams]);

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

  const { data: purchaseOrderList, isLoading } = usePurchaseOrders({
    pagination,
    sorting: sorting[0],
    search,
  });

  const handleShowPDFClick = (serviceOrder: any) => {
    console.log("serviceOrder", serviceOrder);

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

  const columns: ColumnDef<PurchaseOrder>[] = useMemo(() => {
    const baseColumns: ColumnDef<PurchaseOrder>[] = [
      {
        accessorKey: "purchaseOrder",
        header: "Ordem de Compra",
      },
      {
        accessorKey: "serviceOrders",
        header: "Ordem de Serviço",
        enableSorting: false,
        minSize: 320,
        size: 400,
        cell: ({ row }) => {
          return (
            <ShowMoreServiceOrders
              serviceOrders={row.original.serviceOrders}
              onClick={handleShowPDFClick}
            />
          );
        },
      },
      {
        accessorKey: "invoices",
        header: "Número Nota Fiscal",
        enableSorting: false,
        minSize: 320,
        size: 400,
        cell: ({ row }) => {
          return row.original.invoices.length ? (
            <ShowMoreInvoices invoices={row.original.invoices} />
          ) : (
            "-"
          );
        },
      },
      {
        accessorKey: "customer",
        header: "Cliente",
        enableSorting: false,
        cell: ({ row }) => {
          console.log(row);

          return row.original.customer.name;
        },
      },
    ];

    return baseColumns;
  }, []);

  return (
    <>
      <DataTableHeader
        // title="Ordens de Compra"
        onSearchChange={(data) => {
          setSearch(data);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        searchInputDefaultValue={search}
      />
      <DataTable
        columns={columns}
        data={purchaseOrderList?.data ?? []}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        rowCount={purchaseOrderList?.totalCount ?? 0}
        isLoading={isLoading}
      />
    </>
  );
};

export default PurchaseOrdersTable;
