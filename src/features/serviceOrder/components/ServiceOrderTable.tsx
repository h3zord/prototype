import { useMemo, useState } from "react";
import {
  createColumnHelper,
  PaginationState,
  SortingState,
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table";
import { DataTableHeader } from "../../../components";
import { useNavigate } from "react-router-dom";
import { useServiceOrders } from "../api/hooks";
import ServiceOrderDataTable from "./ServiceOrderDatatable";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import { GrCycle } from "react-icons/gr";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { ShowMoreProducts } from "../../../components/ui/table/components/ShowMoreProducts";
import { StatusBadge } from "../../../components/ui/badge/StatusBadge";
import MoreActionsMenu from "../../../components/ui/table/components/MoreActionsMenu";
import {
  ServiceOrderProduct,
  ServiceOrderStatus,
} from "../../../types/models/serviceorder";
import { UnitWithColor } from "../../../components/ui/badge/UnitWithColor";
import { useModal } from "../../../hooks/useModal";
import { usePermission } from "../../../context/PermissionsContext";
import { FaRegFilePdf } from "react-icons/fa";
import { getProductTypeOptions } from "../api/helpers";
import { ItemCodeCell } from "../../../components/ui/badge/ItemCodeCell";
import FilterMenuModal from "../../pcp/modals/FilterMenuModal";
import DefaultPageContainer from "../../../components/layout/DefaultPageContainer";
import ShowMorePurchaseOrders from "../../../features/invoices/components/showMorePurchaseOrders";
import { unitAbbrevOptions } from "../../../helpers/options/customer";
import { TruncatedText } from "../../../components/ui/form/TruncatedText";
import PrintSheetPreview from "../../pcp/modals/PrintSheetPreview";
import DieCutBlockRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairReplacementPDF";
import DieCutBlockReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockReplacementPDF";
import DieCutBlockRepairPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairPDF";
import DieCutBlockPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockPDF";
import ClicheCorrugatedRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairReplacementPDF";
import ClicheCorrugatedReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedReplacementPDF";
import ClicheCorrugatedRepairPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairPDF";
import ClicheCorrugatedPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedPDF";

interface ServiceOrderTableRow {
  id: string | number;
  isHeader?: boolean;
  identificationNumber: string;
  unit: any;
  version: number;
  product: any;
  productType: string;
  customer: { fantasyName: string };
  title: string;
  subTitle: string;
  itemCodeOnCustomer: string;
  dispatchDate: string;
  transport: { fantasyName: string };
  status: string;
  operator: { firstName: string; lastName: string };
  dieCutBlockDetails?: any;
  preparedToDispatch?: boolean;
  previousServiceOrder?: ServiceOrderTableRow;
  purchaseOrder?: string;
  invoiceNumber?: string;
  printSheet?: any;
}

const ServiceOrderTable = () => {
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const { user } = usePermission();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<any>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const openFilterMenu = () => {
    openModal("filterMenu", FilterMenuModal, {
      onClose: () => closeModal("filterMenu"),
      setFilters,
      filters,
    });
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(
      (value) => value !== null && value !== undefined,
    );
  }, [filters]);

  const customerFilter =
    user?.group.name === "Cliente" ? user.customerId : filters.customer;

  const { data: serviceOrdersResult, isLoading } = useServiceOrders({
    pagination,
    sorting: sorting[0],
    search,
    product: filters.product || undefined,
    productType: filters.productType || undefined,
    operator: filters.operator || undefined,
    customer: customerFilter || undefined,
    title: filters.title || undefined,
    subTitle: filters.subTitle || undefined,
    transport: filters.transport || undefined,
    createdFrom: filters.createdFrom || undefined,
    createdTo: filters.createdTo || undefined,
    dispatchedFrom: filters.dispatchedFrom || undefined,
    dispatchedTo: filters.dispatchedTo || undefined,
    statuses:
      filters.status && filters.status.length > 0
        ? filters.status
        : [
            ServiceOrderStatus.WAITING_PRODUCTION,
            ServiceOrderStatus.PREPRESS,
            ServiceOrderStatus.CREDIT_ANALYSIS,
            ServiceOrderStatus.CONFERENCE,
            ServiceOrderStatus.PREASSEMBLY,
            ServiceOrderStatus.IN_APPROVAL,
            ServiceOrderStatus.RECORDING,
            ServiceOrderStatus.LAYOUT,
            ServiceOrderStatus.IMAGE_PROCESSING,
            ServiceOrderStatus.CNC,
            ServiceOrderStatus.DEVELOPMENT,
            ServiceOrderStatus.LAMINATION,
            ServiceOrderStatus.RUBBERIZING,
            ServiceOrderStatus.CANCELLED,
            ServiceOrderStatus.FINALIZED,
            ServiceOrderStatus.DISPATCHED,
          ],
  });

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

  const handleUtilizeClick = (serviceOrder: ServiceOrderTableRow) => {
    navigate(`/serviceorder/${serviceOrder.id}/utilize`, {
      state: { serviceOrder },
    });
  };

  const getRowActions = (serviceOrder: ServiceOrderTableRow) => {
    const actions = [
      {
        label: (
          <div className="flex gap-2 items-center">
            <FaRegFilePdf />
            <div>Ver PDF</div>
          </div>
        ),
        onClick: () => handleShowPDFClick(serviceOrder),
      },
    ];

    if (!serviceOrder.isHeader) {
      actions.push({
        label: (
          <div className="flex gap-2 items-center">
            <GrCycle />
            <div>Aproveitar</div>
          </div>
        ),
        onClick: () => handleUtilizeClick(serviceOrder),
      });
    }

    return actions;
  };

  const columnHelper = createColumnHelper<ServiceOrderTableRow>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("identificationNumber", {
        header: "OS",
        cell: ({ row }) => (
          <div
            className="max-w-[180px] flex items-center gap-2"
            style={{ paddingLeft: row.depth ? "2rem" : 0 }}
          >
            {row.getCanExpand() && !row.depth ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                style={{ cursor: "pointer" }}
              >
                {row.getIsExpanded() ? (
                  <BiChevronDown size={22} />
                ) : (
                  <BiChevronRight size={22} />
                )}
              </button>
            ) : null}
            <div className="flex gap-1 items-center">
              <UnitWithColor unit={row.original.unit as any} />
              {row.original.identificationNumber}{" "}
              {/* <span className="text-sm border border-gray-400 w-fit px-1 rounded">
                v{row.original.version}
              </span> */}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("printSheet", {
        header: "Ficha",
        enableSorting: false,
        cell: ({ row }) => (
          <PrintSheetPreview
            serviceOrderId={Number(row.original.id)}
            printSheet={row.original.printSheet}
          />
        ),
        size: 40,
      }),
      columnHelper.accessor((row) => row.customer?.fantasyName, {
        id: "customer.fantasyName",
        header: "Cliente",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("product", {
        header: "Produto",
        cell: ({ row }) => <ShowMoreProducts serviceOrder={row.original} />,
      }),
      columnHelper.accessor("productType", {
        header: "Tipo de Produto",
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            {getLabelFromValue(
              row.original.productType,
              getProductTypeOptions(row.original.product as any),
            )}
          </div>
        ),
      }),
      columnHelper.accessor("purchaseOrder", {
        header: "Ordem de Compra",
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            {" "}
            <ShowMorePurchaseOrders
              purchaseOrders={
                Array.isArray(row.original.purchaseOrder)
                  ? row.original.purchaseOrder
                  : row.original.purchaseOrder
                    ? [row.original.purchaseOrder]
                    : []
              }
            />
          </div>
        ),
      }),
      columnHelper.accessor("invoiceNumber", {
        header: "Nota Fiscal",
        cell: ({ row }) => (
          <div className="max-w-[180px]">{row.original.invoiceNumber}</div>
        ),
      }),
      columnHelper.accessor("title", {
        header: "Título",
        cell: (info) => (
          <div className="text-[10px]">
            {TruncatedText({ text: info.getValue() })}
          </div>
        ),
      }),
      columnHelper.accessor("subTitle", {
        header: "Subtítulo",
        cell: (info) => (
          <div className="text-[10px]">
            {TruncatedText({ text: info.getValue() })}
          </div>
        ),
      }),
      columnHelper.accessor("itemCodeOnCustomer", {
        header: "Item",
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            <ItemCodeCell serviceOrder={row.original} />
          </div>
        ),
      }),
      // columnHelper.accessor("dispatchDate", {
      //   header: "Despacho",
      //   cell: (info) => <DispatchDateBadge date={info.getValue()} />,
      // }),
      columnHelper.accessor((row) => row.transport?.fantasyName, {
        id: "transport.fantasyName",
        header: "Transporte",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("unit", {
        header: "Uni.",
        cell: ({ row }) => (
          <div className="text-[10px]">
            {row.original.unit
              ? getLabelFromValue(row.original.unit, unitAbbrevOptions)
              : "-"}
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <div className="max-w-[140px]">
            <StatusBadge
              serviceOrder={{
                ...row.original,
                id: String(row.original.id),
                status: row.original.status as any,
                preparedToDispatch: !!row.original.preparedToDispatch,
                operator: { id: "" },
                transport: { id: "" },
              }}
              isClickable={
                user?.group.name === "Administrador" &&
                ![ServiceOrderStatus.FINALIZED].includes(
                  row.original.status as ServiceOrderStatus,
                )
              }
            />
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <MoreActionsMenu actions={getRowActions(row.original)} />
          </div>
        ),
      }),
    ],
    [user],
  ) as ColumnDef<ServiceOrderTableRow, any>[];

  const serviceOrderData = (serviceOrdersResult?.data ?? []).map(
    (order: any) => ({
      ...order,
      purchaseOrder: order.purchaseOrder || "-",
      invoiceNumber: order.invoiceDetails?.nfNumber || "-",
    }),
  );

  return (
    <DefaultPageContainer>
      <DataTableHeader
        // title="Histórico de Ordens de Serviço"
        actions={[]}
        onSearchChange={(data) => {
          setSearch(data);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        onFilterClick={openFilterMenu}
        hasActiveFilters={hasActiveFilters}
      />
      <ServiceOrderDataTable
        columns={columns}
        data={serviceOrderData}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        rowCount={serviceOrdersResult?.totalCount ?? 0}
        setSorting={setSorting}
        isLoading={isLoading}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </DefaultPageContainer>
  );
};

export default ServiceOrderTable;
