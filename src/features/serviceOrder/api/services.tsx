import { ColumnSort, PaginationState } from "@tanstack/react-table";
import { api } from "../../../config/api";
import { PrinterOS } from "../../../types/models/customerprinter";
import {
  ServiceOrderProduct,
  ServiceOrderStatus,
} from "../../../types/models/serviceorder";
import { Unit } from "../../../types/models/customer";

export type GetPrintersByCustomerResponse = PrinterOS[];

export const getPrintersByCustomer = async (
  customerId: number,
): Promise<GetPrintersByCustomerResponse> => {
  const response = await api.get(`/customer/${customerId}/printer/list`);
  return response.data;
};

export type GetPrintersByCustomerAndPrinterResponse = {
  id: number;
  name: string;
  lineatures: string[];
  defaultLineature: string;
  colorsAmount: number;
  hds: string[];
  thicknesses: string[];
}[];

export const getPrintersByCustomerAndPrinter = async (
  customerId: number,
  printerId: number,
): Promise<GetPrintersByCustomerAndPrinterResponse> => {
  const response = await api.get(
    `/customer/${customerId}/printer/${printerId}/list`,
  );
  return response.data;
};

export type UpsertServiceOrderBody = {
  type: string;
  customerId: number;
  budget: number;
  unit: string;
  dispatchDate: string;
  title: string;
  subTitle: string;
  itemCodeOnCustomer: string;
  easyflowFlowType: string;
  printerDetails: {
    thickness: string;
    barCode: string;
    printing: string;
    setAmount: number;
    colorsPattern: string;
    trap: number;
    corrugatedPrinterDetails: {
      cylinder: number;
      polyesterMaxHeight: number;
      polyesterMaxWidth: number;
      clicheMaxWidth: number;
      clicheMaxHeight: number;
      distortion: number;
      profileChannel: string;
      flap: string;
      measures: {
        colors: Array<{
          clicheMeasureId: number;
          height: number;
          id: number;
          quantity: number;
          totalMeasure: number;
          width: number;
        }>;
      };
    };
    colors: Array<{
      recordCliche: boolean;
      ink: string;
      lineature: string;
      angle: number;
      dotType: string;
      curve: string;
      photocellHeight: number;
      photocellWidth: number;
    }>;
  } | null;
  dieCutBlockDetails: {
    measures: {
      channelMinimum: number;
      channelName: string;
      channelQuantity: number;
      dieCutBlockDetailsId: number;
      dieCutBlockImportedCreaseCurve: number;
      dieCutBlockImportedCreaseStraight: number;
      dieCutBlockImportedCutCurve: number;
      dieCutBlockImportedCutStraight: number;
      dieCutBlockImportedPerforationCurve: number;
      dieCutBlockImportedPerforationStraight: number;
      dieCutBlockNationalCreaseCurve: number;
      dieCutBlockNationalCreaseStraight: number;
      dieCutBlockNationalCutCurve: number;
      dieCutBlockNationalCutStraight: number;
      dieCutBlockNationalPerforationCurve: number;
      dieCutBlockNationalPerforationStraight: number;
      id: number;
      totalLinearMetersChannel: number;
      totalMeasuresImported: number;
      totalMeasuresNational: number;
    };
    origin: string;
    shapeFile: string;
    piecesAmount: number;
    po: string;
    view: string;
    boxWidth: number;
    boxHeight: number;
    piecesAmountInWidth: number;
    piecesAmountInHeight: number;
    waveDirection: string;
  } | null;
  printerId: number;
  profileId: number;
  notes: string;
};
export const createServiceOrder = async ({
  file,
  printSheet,
  dieCutBlockSheet,
  data,
}: {
  file: File | Blob;
  printSheet: File | Blob;
  dieCutBlockSheet: File | Blob;
  data: UpsertServiceOrderBody;
}) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("printSheet", printSheet);
  formData.append("dieCutBlockSheet", dieCutBlockSheet);
  formData.append("data", JSON.stringify(data));

  const response = await api.postForm("serviceorder", formData);
  return response.data;
};

export const editServiceOrder = async ({
  id,
  file,
  printSheet,
  dieCutBlockSheet,
  data,
}: {
  id: number;
  file: any;
  printSheet: File | Blob;
  dieCutBlockSheet: File | Blob;
  data: UpsertServiceOrderBody;
}): Promise<any> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("printSheet", printSheet);
  formData.append("dieCutBlockSheet", dieCutBlockSheet);
  formData.append("data", JSON.stringify(data));

  const response = await api.putForm(`serviceorder/${id}`, formData);

  return response.data;
};

export const reuseServiceOrder = async ({
  id,
  file,
  printSheet,
  dieCutBlockSheet,
  data,
}: {
  id: number;
  file: any;
  printSheet: File | Blob;
  dieCutBlockSheet: File | Blob;
  data: UpsertServiceOrderBody;
}): Promise<any> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("printSheet", printSheet);
  formData.append("dieCutBlockSheet", dieCutBlockSheet);
  formData.append("data", JSON.stringify(data));

  const response = await api.postForm(`serviceorder/${id}/reuse`, formData);

  return response.data;
};

export interface GetServiceOrdersParams {
  search?: string;
  product?: string;
  productType?: string;
  operator?: string;
  customer?: string; // Adicionar este campo
  status?: string;
  title?: string;
  subTitle?: string;
  transport?: string;
  statuses?: ServiceOrderStatus[];
  pagination: PaginationState;
  sorting: ColumnSort | undefined;
  createdFrom?: string;
  createdTo?: string;
  dispatchedFrom?: string;
  dispatchedTo?: string;
  hasInvoice?: boolean;
  isDraft?: boolean;
  invoiceStatus?:
    | "no_invoice"
    | "draft_only"
    | "finalized_only"
    | "available_for_billing";
}

export type GetServiceOrdersResponse = {
  data: any[];
  page: number;
  totalCount: number;
};

export type GetDeliveriesOfTheDayResponse = {
  data: any[];
  page: number;
  totalCount: number;
};

// Updated frontend API call to use correct parameter names
export const getServiceOrders = async ({
  pagination,
  search,
  product,
  productType,
  operator,
  customer,
  title,
  subTitle,
  transport,
  createdFrom,
  createdTo,
  dispatchedFrom,
  dispatchedTo,
  status,
  statuses,
  sorting,
  hasInvoice,
  isDraft,
  invoiceStatus,
}: GetServiceOrdersParams): Promise<GetServiceOrdersResponse> => {
  const response = await api.get("serviceorder", {
    params: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      search: search || undefined,
      product: product || undefined,
      productType: productType || undefined,
      operatorId: operator || undefined,
      // Use the exact parameter names expected by the backend
      customerId: customer || undefined, // Changed from 'customer'
      transportId: transport || undefined, // Changed from 'transport'
      title: title || undefined,
      subTitle: subTitle || undefined,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
      dispatchedFrom: dispatchedFrom || undefined,
      dispatchedTo: dispatchedTo || undefined,
      status: status || undefined,
      statuses: statuses,
      sortKey: sorting?.id,
      sortValue:
        sorting?.desc === undefined ? undefined : sorting.desc ? "desc" : "asc",
      hasInvoice: hasInvoice,
      isDraft: isDraft,
      invoiceStatus: invoiceStatus,
    },
  });
  return response.data;
};

export const getInvoicingServiceOrders = async ({
  pagination,
  search,
  product,
  productType,
  operator,
  customer,
  title,
  subTitle,
  transport,
  createdFrom,
  createdTo,
  dispatchedFrom,
  dispatchedTo,
  status,
  statuses,
  sorting,
  hasInvoice,
  isDraft,
  invoiceStatus,
}: GetServiceOrdersParams): Promise<GetServiceOrdersResponse> => {
  const response = await api.get("serviceorder/invoicing", {
    params: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      search: search || undefined,
      product: product || undefined,
      productType: productType || undefined,
      operatorId: operator || undefined,
      customerId: customer || undefined,
      transportId: transport || undefined,
      title: title || undefined,
      subTitle: subTitle || undefined,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
      dispatchedFrom: dispatchedFrom || undefined,
      dispatchedTo: dispatchedTo || undefined,
      status: status || undefined,
      statuses: statuses,
      sortKey: sorting?.id,
      sortValue:
        sorting?.desc === undefined ? undefined : sorting.desc ? "desc" : "asc",
      hasInvoice: hasInvoice,
      isDraft: isDraft,
      invoiceStatus: invoiceStatus,
    },
  });

  return response.data;
};

export interface GetPCPServiceOrdersParams {
  search?: string;
  product?: string;
  productType?: string;
  operator?: string;
  customer?: string; // Adicionado
  status?: string; // Adicionado
  title?: string; // Adicionado
  subTitle?: string; // Adicionado
  transport?: string; // Adicionado
  pagination: PaginationState;
  sorting: ColumnSort | undefined;
  createdFrom?: string;
  createdTo?: string;
  dispatchedFrom?: string;
  dispatchedTo?: string;
}

export interface GetServiceOrderTitlesResponse {
  titles: string[];
  subTitles: string[];
}

export interface ServiceOrderTitlesQuery {
  product?: string | null;
  productType?: string | null;
  customer?: string | null;
  status?: string | null;
  transport?: string | null;
  operator?: string | null;
}

export const getServiceOrderTitles = async (
  query?: ServiceOrderTitlesQuery,
): Promise<GetServiceOrderTitlesResponse> => {
  const response = await api.get("serviceorder/titles", {
    params: query || {},
  });
  return response.data;
};

export const getPCPServiceOrders = async ({
  search,
  product,
  productType,
  operator,
  customer,
  status,
  title,
  subTitle,
  transport,
  pagination,
  sorting,
  createdFrom,
  createdTo,
  dispatchedFrom,
  dispatchedTo,
}: GetPCPServiceOrdersParams): Promise<any> => {
  const response = await api.get("serviceorder/pcp", {
    params: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      search: search || undefined,
      product: product || undefined,
      productType: productType || undefined,
      operatorId: operator || undefined,
      customerId: customer || undefined, // Adicionado
      status: status || undefined, // Adicionado
      title: title || undefined, // Adicionado
      subTitle: subTitle || undefined, // Adicionado
      transportId: transport || undefined, // Adicionado
      sortKey: sorting?.id,
      sortValue:
        sorting?.desc === undefined ? undefined : sorting.desc ? "desc" : "asc",
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
      dispatchedFrom: dispatchedFrom || undefined,
      dispatchedTo: dispatchedTo || undefined,
    },
  });

  return response.data;
};

export interface GetDeliveriesOfTheDayParams {
  search?: string;
  product?: string;
  productType?: string;
  operator?: string;
  customer?: string;
  status?: string;
  title?: string;
  subTitle?: string;
  transport?: string;
  createdFrom?: string;
  sorting: ColumnSort | undefined;
  pagination: PaginationState;
  createdTo?: string;
  dispatchedFrom?: string;
  dispatchedTo?: string;
}

export type UploadExternalPDFBody = {
  serviceOrderId: number;
  file: File;
};

export const uploadExternalPDF = async (
  serviceOrderId: number,
  formData: FormData,
): Promise<any> => {
  const response = await api.patch(
    `/serviceorder/${serviceOrderId}/externalpdf`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const getDeliveriesOfTheDay = async ({
  search,
  product,
  productType,
  operator,
  customer,
  status,
  title,
  subTitle,
  transport,
  pagination, // Adicionado
  sorting, // Adicionado
  createdFrom,
  createdTo,
  dispatchedFrom,
  dispatchedTo,
}: GetDeliveriesOfTheDayParams): Promise<any> => {
  const response = await api.get("serviceorder/deliveriesoftheday", {
    params: {
      page: pagination.pageIndex, // Adicionado
      limit: pagination.pageSize, // Adicionado
      search: search || undefined,
      product: product || undefined,
      productType: productType || undefined,
      operatorId: operator || undefined,
      customerId: customer || undefined,
      status: status || undefined,
      title: title || undefined,
      subTitle: subTitle || undefined,
      transportId: transport || undefined,
      sortKey: sorting?.id, // Adicionado
      // Adicionado
      sortValue:
        sorting?.desc === undefined ? undefined : sorting.desc ? "desc" : "asc",
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
      dispatchedFrom: dispatchedFrom || undefined,
      dispatchedTo: dispatchedTo || undefined,
    },
  });
  return response.data;
};

export type ModifyServiceOrderBody = {
  serviceOrderIds: number[];
  operatorId?: number;
  transportId?: number;
  dispatchDate?: string;
  unit?: Unit;
  status?: ServiceOrderStatus;
  substatus?: ServiceOrderStatus;
};

export const modifyServiceOrder = async (
  body: ModifyServiceOrderBody,
): Promise<void> => {
  const response = await api.patch("serviceorder/modify", body);

  return response.data;
};

export type InsertMeasureCorrugatedClicheBody = {
  serviceOrderIds: number[];
  product: ServiceOrderProduct;
  measures: {
    polyesterLinearMeters?: number;
    channelAmount?: number;
    recordingDate?: string;
    channelLinearMeters?: number;
    colors?: {
      quantity: number;
      width: number;
      height: number;
    }[];
  };
};
export type InsertMeasureDieCutBlockBody = {
  serviceOrderIds: number[];
  product: ServiceOrderProduct;
  measures: {
    channelQuantity: number;
    channelMinimum: number;
    dieCutBlockNationalCutStraight?: number;
    dieCutBlockNationalCutCurve?: number;
    dieCutBlockNationalCreaseStraight?: number;
    dieCutBlockNationalCreaseCurve?: number;
    dieCutBlockNationalPerforationStraight?: number;
    dieCutBlockNationalPerforationCurve?: number;
    dieCutBlockImportedCutStraight?: number;
    dieCutBlockImportedCutCurve?: number;
    dieCutBlockImportedCreaseStraight?: number;
    dieCutBlockImportedCreaseCurve?: number;
    dieCutBlockImportedPerforationStraight?: number;
    dieCutBlockImportedPerforationCurve?: number;
    recordingDate?: string;
  };
};

export type InsertMeasureServiceOrderBody =
  | (InsertMeasureCorrugatedClicheBody & { recordingDate?: string })
  | (InsertMeasureDieCutBlockBody & { recordingDate?: string })
  | undefined;

export const insertMeasureServiceOrder = async (
  body: InsertMeasureServiceOrderBody,
): Promise<void> => {
  if (body && body.measures && !body.measures.recordingDate) {
    if (body.recordingDate) {
      body.measures.recordingDate = body.recordingDate;
      delete body.recordingDate;
      console.log("Added recordingDate to measures:", body);
    }
  }

  const response = await api.post("serviceorder/measure", body);
  return response.data;
};

export type PrepareToDispatchServiceOrderBody = {
  serviceOrderIds: number[];
};

export const prepareToDispatchServiceOrder = async (
  body: PrepareToDispatchServiceOrderBody,
): Promise<void> => {
  const response = await api.post("serviceorder/preparetodispatch", body);

  return response.data;
};

export type GetServiceOrdersListResponse = any[];

export const getServiceOrdersList = async (query?: {
  statuses: ServiceOrderStatus[];
}): Promise<GetServiceOrdersListResponse> => {
  const response = await api.get("serviceorder/list", {
    params: query?.statuses
      ? {
          statuses: query?.statuses,
        }
      : {},
  });

  return response.data;
};

export type UpsertServiceOrderPurchaseOrderBody = {
  serviceOrderIds: number[];
  purchaseOrder: string;
};

export const updateServiceOrderPurchaseOrder = async (
  body: UpsertServiceOrderPurchaseOrderBody,
): Promise<void> => {
  const response = await api.post("serviceorder/purchaseOrder", body);
  return response.data;
};

export type MarkPDFAsSentBody = {
  serviceOrderIds: number[];
};

export const markPDFAsSent = async (body: MarkPDFAsSentBody): Promise<void> => {
  const response = await api.patch("/serviceorder/pdfsent", body);
  return response.data;
};

export const getServiceOrderFile = async (serviceOrderId: number) => {
  const response = await api.get(`/serviceorder/file/${serviceOrderId}`, {
    responseType: "blob",
  });
  return response.data as Blob;
};

export const getprintSheetFile = async (serviceOrderId: number) => {
  const response = await api.get(
    `/serviceorder/print-sheet/${serviceOrderId}`,
    {
      responseType: "blob",
    },
  );
  return response.data as Blob;
};

export const getDieCutBlockSheetFile = async (serviceOrderId: number) => {
  const response = await api.get(
    `/serviceorder/diecutblock-sheet/${serviceOrderId}`,
    {
      responseType: "blob",
    },
  );
  return response.data as Blob;
};

export type SaveAnnotationBody = {
  serviceOrderId: number;
  drawing: string;
};

export const saveAnnotation = async (
  body: SaveAnnotationBody,
): Promise<void> => {
  await api.post("/serviceorder/annotation", body);
};

export type Annotation = {
  id: number;
  user: { id: number; firstName: string; lastName: string };
  drawing: string;
  createdAt: string;
};

export const getServiceOrderAnnotations = async (
  serviceOrderId: number,
): Promise<Annotation[]> => {
  const response = await api.get(`serviceorder/${serviceOrderId}/annotations`);
  return response.data;
};

export type UpdateExternalPDFStatusBody = {
  serviceOrderId: number;
  pdfApprovalStatus: "APROVADO" | "NAO_APROVADO";
};

export const updateExternalPDFStatus = async (
  body: UpdateExternalPDFStatusBody,
): Promise<any> => {
  const response = await api.patch(
    `/serviceorder/${body.serviceOrderId}/externalpdf/status`,
    { pdfApprovalStatus: body.pdfApprovalStatus },
  );
  return response.data;
};

export const getExternalPDF = async (serviceOrderId: number): Promise<Blob> => {
  const response = await api.get(
    `/serviceorder/${serviceOrderId}/externalpdf`,
    {
      responseType: "blob",
      withCredentials: true,
    },
  );
  return response.data;
};

export type RegisterServiceOrderLogBody = {
  serviceOrderId: number;
  previousStatus?: string;
  previousSubStatus?: string;
  newStatus: string;
  newSubStatus?: string;
  changedById: number;
  duration?: number;
};

export const registerServiceOrderLog = async (
  body: RegisterServiceOrderLogBody,
): Promise<void> => {
  await api.post("/serviceorder/log", body);
};

export const getLastStatusLog = async (serviceOrderId: number) => {
  const response = await api.get(
    `/serviceorder/${serviceOrderId}/last-status-log`,
  );
  return response.data as {
    changedAt: string;
    previousStatus?: string;
    newStatus: string;
  };
};

export const generateServiceOrderXML = async (serviceOrderId: number) => {
  const response = await api.get("/serviceorder/generateXMLFile", {
    params: { serviceOrderId },
    responseType: "blob",
  });
  return response.data as Blob;
};
