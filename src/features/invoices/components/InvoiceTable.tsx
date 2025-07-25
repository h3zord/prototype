import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { PiPlusBold } from "react-icons/pi";
import { DataTableHeader, Button } from "../../../components";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";
import { useModal } from "../../../hooks/useModal";
import { useInvoices } from "../api/hooks";
import { Invoice } from "../../../types/models/invoice";
import { formatDate, formatPrice } from "../../../helpers/formatter";
import CreateInvoiceWithSelectModal from "./modals/CreateInvoiceWithSelectModal";
import EditInvoiceWithSelectModal from "./modals/EditInvoiceWithSelectModal";
import { BiSolidEdit, BiSolidTrash } from "react-icons/bi";
import DeleteInvoiceModal from "./modals/DeleteInvoiceModal";
import DataTable from "../../../components/ui/table/data-table/DataTable";
import { useSearchParams } from "react-router-dom";
import ShowMoreServiceOrders from "../../../features/purchaseOrder/components/showMoreServiceOrders";
import ShowMoreCustomers from "../../../features/purchaseOrder/components/showMoreCustomers";
import ShowMorePurchaseOrders from "./showMorePurchaseOrders";
import { ServiceOrderProduct } from "../../../types/models/serviceorder";
import DieCutBlockRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairReplacementPDF";
import DieCutBlockReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockReplacementPDF";
import DieCutBlockRepairPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairPDF";
import DieCutBlockPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockPDF";
import ClicheCorrugatedRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairReplacementPDF";
import ClicheCorrugatedReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedReplacementPDF";
import ClicheCorrugatedRepairPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairPDF";
import ClicheCorrugatedPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedPDF";

const InvoiceTable = () => {
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const searchQuerie = searchParams.get("search");

    if (searchQuerie) {
      setSearch(searchQuerie);
    }
  }, [searchParams]);

  const { hasPermission } = usePermission();
  const { openModal, closeModal } = useModal();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const { data: invoicesResult, isLoading } = useInvoices({
    pagination,
    sorting: sorting[0],
    search,
  });

  console.log("invoicesResult", invoicesResult);

  const handleEditClick = (invoice: Invoice) => {
    console.log("✏️ Editing invoice:", invoice);
    openModal("editInvoice", EditInvoiceWithSelectModal, {
      invoice,
      onClose: () => closeModal("editInvoice"),
    });
  };

  const handleDeleteClick = (invoice: Invoice) => {
    console.log("🗑️ Deleting invoice:", invoice);
    openModal("deleteInvoice", DeleteInvoiceModal, {
      invoice,
      onClose: () => closeModal("deleteInvoice"),
    });
  };

  const openPopupCreate = () => {
    console.log("➕ Opening create-invoice modal");
    openModal("createInvoice", CreateInvoiceWithSelectModal, {
      onClose: () => closeModal("createInvoice"),
    });
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

  const columns: ColumnDef<Invoice>[] = useMemo(() => {
    const baseColumns: ColumnDef<Invoice>[] = [
      {
        accessorKey: "nfNumber",
        header: "NF",
      },
      {
        accessorKey: "serialNumber",
        header: "Número de Série",
        cell: ({ getValue }) => {
          const value = getValue();

          if (
            value === "0" ||
            value === 0 ||
            value === null ||
            value === undefined ||
            value === ""
          ) {
            return "-";
          }

          // Se terminar com "/" e não houver nada depois, remove a barra
          const serial =
            typeof value === "string" && value.endsWith("/")
              ? value.slice(0, -1)
              : value;

          return serial;
        },
      },
      {
        accessorKey: "billingDate",
        header: "Faturada",
        cell: ({ row }) => {
          return formatDate(row.original.billingDate);
        },
      },

      {
        accessorKey: "shippingPrice",
        header: "Frete",
        cell: ({ getValue }) => formatPrice({ price: getValue() as number }),
      },
      // {
      //   accessorKey: "otherPrice",
      //   header: "Outros",
      //   cell: ({ getValue }) => formatPrice({ price: getValue() as number }),
      // },
      // {
      //   accessorKey: "discount",
      //   header: "Desconto",
      //   cell: ({ getValue }) => formatPrice({ price: getValue() as number }),
      // },
      {
        accessorKey: "purchaseOrder",
        header: "Ordem de Compra",
        enableSorting: false,
        minSize: 320,
        size: 420,
        cell: ({ row }) => {
          return (
            <ShowMorePurchaseOrders
              purchaseOrders={row.original.purchaseOrder}
            />
          );
        },
      },
      {
        accessorKey: "serviceOrders",
        header: "Ordem de Serviço",
        enableSorting: false,
        minSize: 320,
        size: 420,
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
        id: "customerName",
        header: "Cliente",
        cell: ({ row }) => (
          <ShowMoreCustomers
            customers={row.original.serviceOrders.map((so) => so.customer)}
          />
        ),
      },
    ];

    baseColumns.push({
      id: "actions",
      header: "Ações",
      cell: ({ row }: { row: { original: Invoice } }) => (
        <div className="flex items-center space-x-3">
          {hasPermission(PERMISSIONS_TYPE.UPDATE_INVOICE) && (
            <BiSolidEdit
              onClick={() => handleEditClick(row.original)}
              size={18}
              className="text-white cursor-pointer"
            />
          )}
          {hasPermission(PERMISSIONS_TYPE.DELETE_INVOICE) && (
            <BiSolidTrash
              onClick={() => handleDeleteClick(row.original)}
              size={18}
              className="text-white cursor-pointer"
            />
          )}
        </div>
      ),
    });

    return baseColumns;
  }, [hasPermission]);

  return (
    <>
      <DataTableHeader
        // title="Notas Fiscais"
        actions={
          hasPermission(PERMISSIONS_TYPE.CREATE_INVOICE)
            ? [
                <Button key="create" onClick={openPopupCreate}>
                  <div className="flex items-center gap-2">
                    <PiPlusBold />
                    <span>Criar Nota Fiscal</span>
                  </div>
                </Button>,
              ]
            : []
        }
        onSearchChange={(data) => {
          setSearch(data);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        searchInputDefaultValue={search}
      />

      <DataTable
        columns={columns}
        data={invoicesResult?.data ?? []}
        pagination={pagination}
        sorting={sorting}
        setSorting={(newSorting) => {
          console.log("↕️ Sorting change:", newSorting);
          setSorting(newSorting);
        }}
        rowCount={invoicesResult?.totalCount ?? 0}
        setPagination={(newPagination) => {
          console.log("🗂️ Pagination change:", newPagination);
          setPagination(newPagination);
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default InvoiceTable;
