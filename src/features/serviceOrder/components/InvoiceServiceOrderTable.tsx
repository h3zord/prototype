import { useMemo, useState, useEffect } from "react";
import {
  createColumnHelper,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { Button, DataTableHeader } from "../../../components";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useInvoicingServiceOrders, useServiceOrders } from "../api/hooks";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { ShowMoreProducts } from "../../../components/ui/table/components/ShowMoreProducts";
import MoreActionsMenu from "../../../components/ui/table/components/MoreActionsMenu";
import {
  DieCutBlockOrigin,
  ServiceOrderProduct,
  ServiceOrderProductType,
  ServiceOrderStatus,
} from "../../../types/models/serviceorder";
import { formatPrice } from "../../../helpers/formatter";
import { useModal } from "../../../hooks/useModal";
import ModifyServiceOrderModal from "../../pcp/modals/ModifyModal";
import { PiPlusBold } from "react-icons/pi";
import CreateInvoiceModal from "./modals/CreateInvoiceModal";
import { UnitWithColor } from "../../../components/ui/badge/UnitWithColor";
import { InvoicePDFModal } from "./InvoicePDFModal";
import { MeasuresRow } from "./MeasuresRow";
import { PriceRow } from "./PriceRow";
import { FaRegFilePdf } from "react-icons/fa";
import { ItemCodeCell } from "../../../components/ui/badge/ItemCodeCell";
import FilterMenuModal from "../../pcp/modals/FilterMenuModal";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import { getProductTypeOptions } from "../api/helpers";
import DataTable from "../../../components/ui/table/data-table/DataTable";
import { useMarkPDFAsSent } from "../api/hooks";
import InlinePDFUploader from "./InlinePDFUploader";
import ExternalPDFApprovalModal from "./modals/ExternalPDFApprovalModal";
import { productTypeAllOptions } from "../../../helpers/options/serviceorder";
import { TruncatedText } from "../../../components/ui/form/TruncatedText";
import {
  productLabels,
  productTypeLabels,
} from "../../pcp/modals/pdfViewer/types";
import { Info } from "lucide-react";
import DieCutBlockRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairReplacementPDF";
import DieCutBlockReplacementPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockReplacementPDF";
import DieCutBlockRepairPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockRepairPDF";
import DieCutBlockPDF from "../../../features/pcp/modals/pdfViewer/DieCutBlockPDF";
import ClicheCorrugatedRepairReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairReplacementPDF";
import ClicheCorrugatedReplacementPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedReplacementPDF";
import ClicheCorrugatedRepairPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedRepairPDF";
import ClicheCorrugatedPDF from "../../../features/pcp/modals/pdfViewer/ClicheCorrugatedPDF";
import { User as UserType } from "src/context/api/PermissionsService";
import { api } from "../../../config/api";

const statusLabels: Record<string, string> = {
  WAITING_PRODUCTION: "Aguardando Produção",
  PREPRESS: "Pré-impressão",
  CREDIT_ANALYSIS: "Análise de Crédito",
  CONFERENCE: "Conferência",
  PREASSEMBLY: "Pré-montagem",
  IN_APPROVAL: "Em Aprovação",
  RECORDING: "Gravação",
  LAYOUT: "Layout",
  IMAGE_PROCESSING: "Processamento de Imagem",
  CNC: "CNC",
  DEVELOPMENT: "Desenvolvimento",
  LAMINATION: "Laminação",
  RUBBERIZING: "Borrachização",
  CANCELLED: "Cancelado",
  FINALIZED: "Finalizado",
  DISPATCHED: "Despachado",
};

const CustomerPriceRow = ({ serviceOrder }: any) => {
  const isRepair = serviceOrder?.productType === ServiceOrderProductType.REPAIR;

  const isReassembly =
    serviceOrder?.productType === ServiceOrderProductType.REASSEMBLY;
  const hasImageProcessing = serviceOrder?.printerDetails?.imageProcessing;
  const hasFinalArt = serviceOrder?.printerDetails?.finalArt;
  const hasEasyFlow = serviceOrder?.printerDetails?.easyflow;
  const hasPrinter = serviceOrder?.printerDetails?.quantityPrinter > 0;
  const hasProofICC = serviceOrder?.printerDetails?.quantityProfileTest > 0;
  const hasDieCutBlockNational =
    serviceOrder?.dieCutBlockDetails?.origin.includes(
      DieCutBlockOrigin.NATIONAL
    );
  const hasDieCutBlockImported =
    serviceOrder?.dieCutBlockDetails?.origin.includes(
      DieCutBlockOrigin.IMPORTED
    );

  return (
    <div className="text-[10px]">
      {serviceOrder.product === ServiceOrderProduct.DIECUTBLOCK ? (
        <div>
          {hasDieCutBlockNational && (
            <div>{`Forma Nacional: ${formatPrice({ price: serviceOrder.dieCutBlockNationalPrice, digits: 3 })}`}</div>
          )}

          {hasDieCutBlockImported && (
            <div>{`Forma Importada: ${formatPrice({ price: serviceOrder.dieCutBlockImportedPrice, digits: 3 })}`}</div>
          )}
        </div>
      ) : null}

      {serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED ? (
        <div>
          {isReassembly ? (
            <div>{`Remontagem: ${formatPrice({ price: serviceOrder.clicheReAssemblyPrice, digits: 3 })}`}</div>
          ) : null}

          {!isRepair && !isReassembly ? (
            <div>{`Clichê: ${formatPrice({ price: serviceOrder.clicheCorrugatedPrice, digits: 3 })}`}</div>
          ) : null}

          {isRepair && (
            <div>{`Conserto: ${formatPrice({ price: serviceOrder.clicheRepairPrice })}`}</div>
          )}
          {/* {isReform && (
            <div>Reforma: {formatPrice(serviceOrder.clicheReformPrice)}</div>
          )} */}
          {hasImageProcessing && (
            <div>{`Trat. Image: ${formatPrice({ price: serviceOrder.imageProcessingPrice })}`}</div>
          )}
          {hasFinalArt && (
            <div>{`Arte Final: ${formatPrice({ price: serviceOrder.finalArtPrice })}`}</div>
          )}
          {hasEasyFlow && (
            <div>{`Easyflow: ${formatPrice({ price: serviceOrder.easyflowPrice })}`}</div>
          )}
          {hasPrinter && (
            <div>{`Printer: ${formatPrice({ price: serviceOrder.printingPrice })}`}</div>
          )}
          {hasProofICC && (
            <div>
              {`Prova ICC: ${formatPrice({ price: serviceOrder.profileProofIccPrice })}`}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

const InvoiceServiceOrderTable = () => {
  const markPDFAsSentMutation = useMarkPDFAsSent();

  const { openModal, closeModal } = useModal();

  const {
    loading,
    hasPermission,
    user,
  }: {
    loading: boolean;
    hasPermission: (permission: string) => boolean;
    user: UserType | null;
  } = usePermission();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: -1,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<any>({});
  const [filterMessage, setFilterMessage] = useState<React.ReactNode>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [groupFiltersApplied, setGroupFiltersApplied] = useState(false);

  const [persistentSelectedIds, setPersistentSelectedIds] = useState<
    Set<string>
  >(new Set());

  // Função para buscar configurações do grupo da API
  const getGroupConfiguration = async (groupId: number) => {
    try {
      const response = await api.get("/permissions/list");
      const groups = response.data;

      const userGroup = groups.find((group: any) => group.id === groupId);
      return userGroup || null;
    } catch (error) {
      console.error("Error fetching group configuration:", error);
      return null;
    }
  };

  // Função para construir filtros de status a partir da configuração do grupo
  const buildStatusFiltersFromGroup = (groupConfig: any) => {
    if (!groupConfig?.defaultFilters?.defaultStatus) {
      return null;
    }

    // Se defaultStatus for um array, junta com vírgula
    if (Array.isArray(groupConfig.defaultFilters.defaultStatus)) {
      return groupConfig.defaultFilters.defaultStatus.join(",");
    }

    // Se for string, retorna diretamente
    return groupConfig.defaultFilters.defaultStatus;
  };

  // useEffect para ler parâmetros da URL
  useEffect(() => {
    const product = searchParams.get("product");
    const productType = searchParams.get("productType");
    const statusParam = searchParams.get("status");

    let status = null;
    if (statusParam) {
      if (statusParam.includes(",")) {
        status = statusParam
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      } else {
        status = [statusParam.trim()];
      }
    }

    setFilters({
      product,
      productType,
      status,
    });

    // Marca que os filtros foram aplicados se há parâmetros na URL
    if (product || productType || statusParam) {
      setGroupFiltersApplied(true);
    }
  }, [searchParams]);

  // useEffect para aplicar filtros do grupo dinamicamente
  useEffect(() => {
    const applyGroupFilters = async () => {
      if (!user?.group?.id || groupFiltersApplied) {
        return;
      }

      try {
        const groupConfig = await getGroupConfiguration(user.group.id);

        if (!groupConfig) {
          return;
        }

        const hasExistingParams = searchParams.toString().length > 0;
        const currentStatus = searchParams.get("status");

        // Verifica se há filtros de status padrão para o grupo
        const groupStatusFilters = buildStatusFiltersFromGroup(groupConfig);

        if (groupStatusFilters && (!hasExistingParams || !currentStatus)) {
          // Aplica os filtros do grupo
          const otherParams = new URLSearchParams(searchParams);
          otherParams.set("status", groupStatusFilters);

          // Aplica outros filtros padrão se existirem
          if (groupConfig.defaultFilters?.defaultProduct) {
            otherParams.set(
              "product",
              groupConfig.defaultFilters.defaultProduct
            );
          }

          if (groupConfig.defaultFilters?.defaultProductType) {
            otherParams.set(
              "productType",
              groupConfig.defaultFilters.defaultProductType
            );
          }

          if (groupConfig.defaultFilters?.defaultCustomer) {
            otherParams.set(
              "customer",
              groupConfig.defaultFilters.defaultCustomer
            );
          }

          navigate(`/invoiceserviceorder?${otherParams.toString()}`, {
            replace: true,
          });
          setGroupFiltersApplied(true);
        }
      } catch (error) {
        console.error("Error applying group filters:", error);
      }
    };

    if (user?.group?.id && !groupFiltersApplied) {
      applyGroupFilters();
    }
  }, [user?.group?.id, searchParams, navigate, groupFiltersApplied]);

  // useEffect para reaplica filtros quando volta ao menu sem parâmetros
  useEffect(() => {
    const reapplyGroupFilters = async () => {
      const hasAnyParams = searchParams.toString().length > 0;

      // Se não há parâmetros na URL e o usuário tem um grupo, reaplica os filtros padrão
      if (!hasAnyParams && user?.group?.id && groupFiltersApplied) {
        try {
          const groupConfig = await getGroupConfiguration(user.group.id);

          if (groupConfig) {
            const groupStatusFilters = buildStatusFiltersFromGroup(groupConfig);

            if (groupStatusFilters) {
              const params = new URLSearchParams();
              params.set("status", groupStatusFilters);

              // Aplica outros filtros padrão se existirem
              if (groupConfig.defaultFilters?.defaultProduct) {
                params.set(
                  "product",
                  groupConfig.defaultFilters.defaultProduct
                );
              }

              if (groupConfig.defaultFilters?.defaultProductType) {
                params.set(
                  "productType",
                  groupConfig.defaultFilters.defaultProductType
                );
              }

              if (groupConfig.defaultFilters?.defaultCustomer) {
                params.set(
                  "customer",
                  groupConfig.defaultFilters.defaultCustomer
                );
              }

              navigate(`/invoiceserviceorder?${params.toString()}`, {
                replace: true,
              });
            }
          }
        } catch (error) {
          console.error("Error reapplying group filters:", error);
        }
      }
    };

    reapplyGroupFilters();
  }, [searchParams, user?.group?.id, navigate, groupFiltersApplied]);

  const { data: serviceOrdersResult, isLoading } = useInvoicingServiceOrders({
    pagination,
    sorting: sorting[0],
    search,
    ...filters,
    statuses: [ServiceOrderStatus.DISPATCHED],
    invoiceStatus: "available_for_billing",
  });

  console.log("serviceOrdersResult", serviceOrdersResult);

  const { data: allServiceOrdersResult } = useInvoicingServiceOrders({
    pagination: {
      pageIndex: 0,
      pageSize: 99999,
    },
    search,
    ...filters,
    statuses: [ServiceOrderStatus.DISPATCHED],
    invoiceStatus: "available_for_billing",
  });

  const { data: serviceOrdersDispatched } = useServiceOrders({
    pagination: {
      pageIndex: 0,
      pageSize: 99999,
    },
    sorting: sorting[0],
    statuses: [ServiceOrderStatus.DISPATCHED],
    invoiceStatus: "available_for_billing",
  });

  const totalPrice = allServiceOrdersResult?.data.reduce((acc, curr) => {
    return acc + (curr.totalPrice ?? 0);
  }, 0);

  // Lógica para exibir mensagem de filtro
  useEffect(() => {
    let message = null;
    const messageParts = [];

    if (filters.product) {
      messageParts.push(
        <>
          produto{" "}
          <strong className="text-yellow-300">
            {productLabels[filters.product]}
          </strong>
        </>
      );
    }
    if (filters.productType) {
      messageParts.push(
        <>
          tipo{" "}
          <strong className="text-yellow-300">
            {productTypeLabels[filters.productType]}
          </strong>
        </>
      );
    }

    if (filters.status && filters.status.length > 0) {
      const statusLabelsTranslated = filters.status
        .map((s: string) => statusLabels[s] || s.replace(/_/g, " "))
        .join(", ");
      messageParts.push(
        <>
          status{" "}
          <strong className="text-yellow-300">{statusLabelsTranslated}</strong>
        </>
      );
    }

    if (messageParts.length > 0) {
      message = (
        <div className="flex items-center gap-2 text-white px-3 py-1">
          <Info size={16} className="text-yellow-400" />
          <span>
            Exibindo OS para{" "}
            {messageParts.map((part, index) => (
              <span key={index}>
                {index > 0 && " e "}
                {part}
              </span>
            ))}
          </span>
        </div>
      );
    }
    setFilterMessage(message);
  }, [filters]);

  const handleRowSelectionChange = (updaterOrValue: any) => {
    setRowSelection((prev) => {
      const newSelection =
        typeof updaterOrValue === "function"
          ? updaterOrValue(prev)
          : updaterOrValue;

      const newPersistentIds = new Set(persistentSelectedIds);

      Object.keys(prev).forEach((id) => {
        if (!newSelection[id]) {
          newPersistentIds.delete(id);
        }
      });

      Object.keys(newSelection).forEach((id) => {
        if (newSelection[id]) {
          newPersistentIds.add(id);
        }
      });

      setPersistentSelectedIds(newPersistentIds);
      return newSelection;
    });
  };

  useEffect(() => {
    if (serviceOrdersDispatched?.data.length) {
      const newRowSelection: RowSelectionState = {};

      serviceOrdersDispatched?.data.forEach((item: any) => {
        if (persistentSelectedIds.has(String(item.id))) {
          newRowSelection[String(item.id)] = true;
        }
      });

      setRowSelection(newRowSelection);
    }
  }, [serviceOrdersDispatched, persistentSelectedIds]);

  const getSelectedServiceOrders = () => {
    const allOrders = serviceOrdersDispatched?.data ?? [];

    return allOrders.filter((so: any) =>
      persistentSelectedIds.has(String(so.id))
    );
  };

  const clearSelection = () => {
    setPersistentSelectedIds(new Set());
    setRowSelection({});
  };

  const productTypeOptions = productTypeAllOptions.filter(
    (productType) =>
      productType.value !== ServiceOrderProductType.REPLACEMENT &&
      productType.value !== ServiceOrderProductType.TEST
  );

  const openFilterMenu = () => {
    openModal("filterMenu", FilterMenuModal, {
      onClose: () => closeModal("filterMenu"),
      setFilters,
      filters,
      productTypeOptions,
    });
  };

  const hasActiveFilters = useMemo(() => {
    const hasRegularFilters = Object.values(filters).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== undefined;
    });

    return hasRegularFilters;
  }, [filters]);

  const handleCreateInvoiceClick = (serviceOrders: any) => {
    openModal("createInvoice", CreateInvoiceModal, {
      serviceOrders,
      onClose: () => {
        closeModal("createInvoice");
        clearSelection();
      },
    });
  };

  const handleGenerateInvoicePDFClick = (serviceOrders: any) => {
    const dieCutBlockOrders = serviceOrders.filter(
      (order: any) => order.product === ServiceOrderProduct.DIECUTBLOCK
    );

    const clicheCorrugatedOrders = serviceOrders.filter(
      (order: any) => order.product === ServiceOrderProduct.CLICHE_CORRUGATED
    );

    const ordersToMark = serviceOrders.filter((so: any) => !so.pdfSent);

    if (ordersToMark.length > 0) {
      const serviceOrderIds = ordersToMark.map((so: any) => so.id);

      markPDFAsSentMutation.mutate({ serviceOrderIds });
    }

    const hasMultipleProductTypes =
      dieCutBlockOrders.length > 0 && clicheCorrugatedOrders.length > 0;

    openModal("invoicePDFModal", InvoicePDFModal, {
      hasMultipleProductTypes,
      serviceOrders: hasMultipleProductTypes ? undefined : serviceOrders,
      dieCutBlockOrders: hasMultipleProductTypes
        ? dieCutBlockOrders
        : undefined,
      clicheCorrugatedOrders: hasMultipleProductTypes
        ? clicheCorrugatedOrders
        : undefined,
      onClose: () => closeModal("invoicePDFModal"),
    });
  };

  const handleModifyClick = (serviceOrder: any) => {
    openModal("modifyServiceOrder", ModifyServiceOrderModal, {
      selectedServiceOrder: serviceOrder,
      onClose: () => closeModal("modifyServiceOrder"),
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

  const getRowActions = (serviceOrder: any) => {
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

    if (hasPermission(PERMISSIONS_TYPE.UPDATE_SERVICE_ORDER)) {
      actions.push({
        label: (
          <div className="flex gap-2 items-center">
            <MdOutlineModeEditOutline size={14} />
            <div className="break-words">Alterar Dados</div>
          </div>
        ),
        onClick: () => handleModifyClick(serviceOrder),
      });
    }

    return actions;
  };

  const columnHelper = createColumnHelper<any>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("identificationNumber", {
        header: "OS",
        cell: ({ row }) => (
          <div
            className="max-w-[180px] flex items-center gap-2"
            style={{ paddingLeft: row.depth && "2rem" }}
          >
            {row.getCanExpand() && !row.depth ? (
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: "pointer" },
                }}
              >
                {row.getIsExpanded() ? (
                  <BiChevronDown size={22} />
                ) : (
                  <BiChevronRight size={22} />
                )}
              </button>
            ) : null}
            <div className="flex gap-1 items-center">
              <UnitWithColor unit={row.original.unit} />
              {`${row.original.identificationNumber} `}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("customer.fantasyName", {
        header: "Cliente",
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("externalCustomer.fantasyName", {
        header: "Faturado",
        cell: ({ row }) =>
          row.original.externalCustomer?.fantasyName
            ? row.original.externalCustomer?.fantasyName
            : "-",
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
              getProductTypeOptions(row.original.product)
            )}
          </div>
        ),
      }),

      columnHelper.accessor("itemCodeOnCustomer", {
        header: "Item",
        enableSorting: false,
        cell: ({ row }) => <ItemCodeCell serviceOrder={row.original} />,
      }),
      columnHelper.accessor("title", {
        header: "Título",
        cell: (info) => (
          <div className="text-[10px]">
            {TruncatedText({ text: info.getValue() })}
          </div>
        ),
      }),
      columnHelper.accessor("purchaseOrder", {
        header: "OC",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("invoiceDetails", {
        header: "Pré-Nota",
        enableSorting: false,
        cell: ({ row }) => {
          const serviceOrder = row.original;
          const hasDraftInvoice = serviceOrder.invoiceDetails?.isDraft === true;

          if (hasDraftInvoice) {
            return (
              <span className="inline-block text-nowrap bg-blue-500 text-white px-1 rounded-xl font-semibold border border-blue-600 text-[10px]">
                Pré-nota criada
              </span>
            );
          }

          return <span className="text-gray-400">-</span>;
        },
      }),
      columnHelper.accessor("pdfSent", {
        header: "Faturamento",
        enableSorting: false,
        cell: ({ row }) => {
          const serviceOrder = row.original;

          if (loading) return null;
          else if (serviceOrder.externalCustomer) {
            switch (serviceOrder.pdfApprovalStatus) {
              case "APROVADO":
                return (
                  <span className="inline-block bg-green-500 text-white px-2 py-1 rounded-xl font-semibold border border-green-600">
                    PDF aprovado
                  </span>
                );
              case "AGUARDANDO_APROVACAO":
                if (hasPermission("UPDATE_EXTERNALPDF")) {
                  return (
                    <button
                      onClick={() =>
                        openModal(
                          "externalPDFApproval",
                          ExternalPDFApprovalModal,
                          {
                            serviceOrder,
                            onClose: () => closeModal("externalPDFApproval"),
                          }
                        )
                      }
                      className="bg-yellow-500 text-white px-2 py-1 rounded-xl font-semibold border border-yellow-600"
                    >
                      Aguardando aprovação
                    </button>
                  );
                }
                return (
                  <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded-xl font-semibold border border-yellow-600">
                    Aguardando aprovação
                  </span>
                );
              case "NAO_APROVADO":
                if (hasPermission("UPDATE_EXTERNALPDF")) {
                  return (
                    <button
                      onClick={() =>
                        openModal(
                          "externalPDFApproval",
                          ExternalPDFApprovalModal,
                          {
                            serviceOrder,
                            onClose: () => closeModal("externalPDFApproval"),
                          }
                        )
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded-xl font-semibold border border-red-600"
                    >
                      Não aprovado
                    </button>
                  );
                }
                return (
                  <InlinePDFUploader
                    serviceOrder={serviceOrder}
                    initialLabel="Enviar PDF"
                  />
                );
              default:
                return (
                  <InlinePDFUploader
                    serviceOrder={serviceOrder}
                    initialLabel="Enviar PDF"
                  />
                );
            }
          }

          return serviceOrder.pdfSent ? (
            <span className="inline-block bg-green-500 text-nowrap text-[10px] text-white px-1 rounded-xl font-semibold border border-green-600">
              PDF enviado
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
      }),

      columnHelper.accessor("measures", {
        header: "Metragem",
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="min-w-[100px] max-w-[100px]">
              <MeasuresRow serviceOrder={row.original} />
            </div>
          );
        },
      }),
      columnHelper.accessor("budget", {
        header: "Orçamento",
        cell: (info) => <div>{formatPrice({ price: info.getValue() })}</div>,
        enableSorting: false,
      }),
      columnHelper.accessor("price", {
        header: "Valor de Tabela",
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="min-w-[70px]">
              <PriceRow serviceOrder={row.original} />
            </div>
          );
        },
      }),
      columnHelper.accessor("customerPrice", {
        header: "Preço Cliente",
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="min-w-[100px]">
              <CustomerPriceRow serviceOrder={row.original} />
            </div>
          );
        },
      }),
      columnHelper.accessor("recordingDate", {
        header: "Gravação",
        cell: (info) => {
          const value = info.getValue() as string;
          if (!value) return "-";

          const date = new Date(value);

          return new Intl.DateTimeFormat("pt-BR", {
            timeZone: "UTC",
          }).format(new Date(date));
        },
      }),
      columnHelper.accessor("dispatchedDate", {
        header: "Despachada",
        cell: (info) => {
          const value = info.getValue() as string;
          if (!value) return "-";

          const date = new Date(value);
          return new Intl.DateTimeFormat("pt-BR").format(date);
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <MoreActionsMenu actions={getRowActions(row.original)} />
        ),
      }),
    ],
    [loading, hasPermission]
  );

  return (
    <>
      <DataTableHeader
        // title="Faturamento"
        onSearchChange={(data) => {
          setSearch(data);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        onFilterClick={openFilterMenu}
        hasActiveFilters={hasActiveFilters}
        filterMessage={filterMessage}
        actions={[
          persistentSelectedIds.size > 0 &&
            (() => {
              const selectedServiceOrders = getSelectedServiceOrders();

              const canShowInvoiceButton = selectedServiceOrders.every(
                (order: any) => {
                  if (order.externalCustomer) {
                    return order.pdfApprovalStatus === "APROVADO";
                  }
                  return true;
                }
              );

              return (
                <>
                  {canShowInvoiceButton &&
                    hasPermission(PERMISSIONS_TYPE.CREATE_INVOICE) && (
                      <Button
                        key="create-invoice"
                        onClick={() =>
                          handleCreateInvoiceClick(selectedServiceOrders)
                        }
                      >
                        <div className="flex items-center gap-2">
                          <PiPlusBold />
                          <span>Cadastrar NF e OC</span>
                        </div>
                      </Button>
                    )}

                  {hasPermission(PERMISSIONS_TYPE.GENERATE_PDF) && (
                    <Button
                      key="generate-pdf"
                      onClick={() => {
                        handleGenerateInvoicePDFClick(selectedServiceOrders);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FaRegFilePdf />
                        <span>Gerar PDF</span>
                      </div>
                    </Button>
                  )}
                </>
              );
            })(),
        ]}
      />

      <DataTable
        columns={columns}
        data={serviceOrdersResult?.data ?? []}
        rowSelection={rowSelection}
        setRowSelection={handleRowSelectionChange}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={serviceOrdersResult?.totalCount ?? 0}
        sorting={sorting}
        setSorting={setSorting}
        isLoading={isLoading}
        totalPrice={totalPrice}
        totalInvoice={0}
        osNumber={serviceOrdersResult?.totalCount ?? 0}
        // getRowId={(row) => String(row.id)}
      />
    </>
  );
};

export default InvoiceServiceOrderTable;
