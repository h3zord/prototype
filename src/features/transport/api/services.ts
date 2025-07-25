import { ColumnSort, PaginationState } from "@tanstack/react-table";
import { api } from "../../../config/api";
import { Transport } from "../../../types/models/transport";

export type GetTransportsParams = {
  pagination: PaginationState;
  sorting: ColumnSort | undefined;
  search: string;
};

export type GetTransportsResponse = {
  data: Transport[];
  page: number;
  totalCount: number;
};

export const getTransports = async ({
  pagination,
  search,
  sorting,
}: GetTransportsParams): Promise<GetTransportsResponse> => {
  const response = await api.get("transport", {
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

export type UpsertTransportBody = {
  id?: number;
  cpfCnpj: string;
  ie?: string;
  name: string;
  fantasyName: string;
  phone: string;
  unit: string;
  financialEmail: string;
  personType: string;
  postalCode: string;
  street: string;
  neighborhood: string;
  number: string;
  complement: string;
  city: string;
  state: string;
};

export const createTransport = async (
  body: UpsertTransportBody,
): Promise<Transport> => {
  const response = await api.post("transport", body);
  return response.data;
};

export type EditTransportRequest = { id: number; body: UpsertTransportBody };

export const editTransport = async ({
  id,
  body,
}: EditTransportRequest): Promise<Transport> => {
  const response = await api.put(`transport/${id}`, body);
  return response.data;
};

export type DeleteTransportRequest = { id: number };

export const deleteTransport = async ({
  id,
}: DeleteTransportRequest): Promise<void> => {
  const response = await api.delete(`transport/${id}`);
  return response.data;
};

export type GetTransportsListResponse = Transport[];

export const getTransportsList =
  async (): Promise<GetTransportsListResponse> => {
    const response = await api.get("transport/list");

    return response.data;
  };
