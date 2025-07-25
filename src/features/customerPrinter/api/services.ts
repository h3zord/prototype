import { ColumnSort, PaginationState } from "@tanstack/react-table";
import { api } from "../../../config/api";
import {
  Printer,
  PrinterTypeBack,
  Curve,
} from "../../../types/models/customerprinter";

export type UpsertPrinterBody = {
  id?: number;
  type:
    | PrinterTypeBack.CORRUGATED_PRINTER
    | PrinterTypeBack.NARROW_WEB_PRINTER
    | PrinterTypeBack.WIDE_WEB_PRINTER;
  name: string;
  colorsAmount: number;
  trap: number;
  lineatures: string[];
  dotTypes: string[];
  thicknesses: string[];
  curves: string[];
  angles: string[];
  corrugatedPrinter: {
    variation: number;
    flap: string;
    channels: number[];
    channelMinimum: number;
  };
};

export type CreateChannelBody = {
  name: string;
};

export type UpdateChannelBody = {
  name: string;
};

export type Channel = {
  id: number;
  name: string;
};

export type CreateCurveBody = {
  name: string;
};

export type UpdateCurveBody = {
  name: string;
};

export const createPrinter = async (
  idCustomer: number,
  body: UpsertPrinterBody,
): Promise<UpsertPrinterBody> => {
  const response = await api.post(`customer/${idCustomer}/printer`, body);
  return response.data;
};

// Channel Services
export const getChannels = async (): Promise<Channel[]> => {
  const response = await api.get("channel");
  return response.data;
};

export const createChannel = async (
  body: CreateChannelBody,
): Promise<Channel> => {
  const response = await api.post("channel", body);
  return response.data;
};

export const updateChannel = async (
  id: number,
  body: UpdateChannelBody,
): Promise<Channel> => {
  const response = await api.put(`channel/${id}`, body);
  return response.data;
};

export const deleteChannel = async (id: number): Promise<Channel> => {
  const response = await api.delete(`channel/${id}`);
  return response.data;
};

// Curve Services
export const getCurves = async (): Promise<Curve[]> => {
  const response = await api.get("curve");
  return response.data;
};

export const createCurve = async (body: CreateCurveBody): Promise<Curve> => {
  const response = await api.post("curve", body);
  return response.data;
};

export const updateCurve = async (
  id: number,
  body: UpdateCurveBody,
): Promise<Curve> => {
  const response = await api.put(`curve/${id}`, body);
  return response.data;
};

export const deleteCurve = async (id: number): Promise<Curve> => {
  const response = await api.delete(`curve/${id}`);
  return response.data;
};

// Atualizar uma Printer existente
export const editPrinter = async ({
  idCustomer,
  id,
  body,
}: {
  idCustomer: number;
  id: number;
  body: UpsertPrinterBody;
}): Promise<UpsertPrinterBody> => {
  const response = await api.put(`customer/${idCustomer}/printer/${id}`, body);
  return response.data;
};

// Deletar uma Printer
export const deletePrinter = async ({
  idCustomer,
  id,
}: {
  idCustomer: number;
  id: number;
}): Promise<void> => {
  const response = await api.delete(`customer/${idCustomer}/printer/${id}`);
  return response.data;
};

export type GetPrintersParams = {
  idCustomer: number;
  pagination: PaginationState;
  sorting: ColumnSort | undefined;
  search: string;
};

export type GetPrintersResponse = {
  idCustomer: number;
  data: Printer[];
  page: number;
  totalCount: number;
};

// Listar Printers com paginação
export const getPrinters = async ({
  idCustomer,
  pagination,
  search,
  sorting,
}: GetPrintersParams): Promise<GetPrintersResponse> => {
  const response = await api.get(`customer/${idCustomer}/printer`, {
    params: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      search: search || undefined,
      sortKey: sorting?.id,
      sortValue:
        sorting?.desc === undefined ? undefined : sorting.desc ? "desc" : "asc",
    },
  });

  return response.data;
};

export type GetPrinterParams = {
  idCustomer: number;
  idPrinter: number;
};

export type GetPrinterResponse = Printer;

export const getPrinter = async ({
  idCustomer,
  idPrinter,
}: GetPrinterParams): Promise<GetPrinterResponse> => {
  const response = await api.get(`customer/${idCustomer}/printer/${idPrinter}`);

  return response.data;
};
