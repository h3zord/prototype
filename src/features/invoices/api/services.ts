import { ColumnSort, PaginationState } from "@tanstack/react-table";
import { User } from "../../../types/models/user";
import { api } from "../../../config/api";
import { Invoice } from "src/types/models/invoice";
import type { GetInvoiceNumbersResponse } from "./hooks";

export type GetInvoicesParams = {
  pagination: PaginationState;
  sorting?: ColumnSort;
  search?: string;
};

export type GetInvoicesResponse = {
  data: Invoice[];
  page: number;
  totalCount: number;
};

export const getInvoices = async ({
  pagination,
  search,
  sorting,
}: GetInvoicesParams): Promise<GetInvoicesResponse> => {
  const response = await api.get("invoice", {
    params: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      search: search,
      sortKey: sorting?.id,
      sortValue:
        sorting?.desc === undefined ? undefined : sorting.desc ? "desc" : "asc",
    },
  });
  return response.data;
};

export type GetUsersListResponse = User[];

export type UpsertServiceOrderInvoiceBody = {
  serviceOrderIds: number[];
  invoiceDetails: {
    nfNumber: string;
    serialNumber: string;
    invoiceDate: string;
    billingDate: string;
    purchaseOrder: string[];
    shippingPrice: string | number;
    otherPrice: string | number;
    discount: string | number;
    isDraft?: boolean;
  };
};

export const createServiceOrderInvoice = async (
  body: UpsertServiceOrderInvoiceBody,
): Promise<void> => {
  const response = await api.post("invoice", body);

  return response.data;
};

export type UpdateServiceOrderInvoiceRequest = {
  id: number;
  body: UpsertServiceOrderInvoiceBody;
};

export const updateServiceOrderInvoice = async ({
  id,
  body,
}: {
  id: number;
  body: UpsertServiceOrderInvoiceBody;
}): Promise<void> => {
  const response = await api.put(`invoice/${id}`, body);

  return response.data;
};

export type DeleteInvoiceRequest = { id: number };

export const deleteInvoice = async ({
  id,
}: DeleteInvoiceRequest): Promise<void> => {
  const response = await api.delete(`invoice/${id}`);

  return response.data;
};

export const getInvoiceNumbersList = async (query?: {
  serviceOrderId?: string;
}): Promise<GetInvoiceNumbersResponse[]> => {
  const response = await api.get("invoice/numbers", {
    params: query?.serviceOrderId
      ? {
          serviceOrderId: query?.serviceOrderId,
        }
      : {},
  });
  return response.data;
};
