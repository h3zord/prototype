import { PaginationState, ColumnSort } from "@tanstack/react-table";
import { api } from "../../../config/api";

export type UpsertProfileBody = {
  name: string;
  colors: any;
};

export const createProfile = async (
  idCustomer: number,
  idPrinter: number,
  body: UpsertProfileBody,
): Promise<UpsertProfileBody> => {
  const response = await api.post(
    `/customer/${idCustomer}/printer/${idPrinter}/profile/`,
    body,
  );
  return response.data;
};

export const editProfile = async (
  idCustomer: number,
  idPrinter: number,
  id: number,
  body: UpsertProfileBody,
): Promise<UpsertProfileBody> => {
  const response = await api.put(
    `/customer/${idCustomer}/printer/${idPrinter}/profile/${id}`,
    body,
  );
  return response.data;
};

export const deleteProfile = async (
  idCustomer: number,
  idPrinter: number,
  id: number,
): Promise<void> => {
  await api.delete(
    `/customer/${idCustomer}/printer/${idPrinter}/profile/${id}`,
  );
};

export type GetProfileParams = {
  idCustomer: number;
  idPrinter: number;
  pagination: PaginationState;
  sorting: ColumnSort | undefined;
  search: string;
};

export type GetProfileResponse = {
  idCustomer: number;
  idPrinter: number;
  data: UpsertProfileBody[];
  page: number;
  totalCount: number;
};

export const getProfiles = async ({
  idCustomer,
  idPrinter,
  pagination,
  search,
  sorting,
}: GetProfileParams): Promise<GetProfileResponse> => {
  const response = await api.get(
    `/customer/${idCustomer}/printer/${idPrinter}/profile`,
    {
      params: {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        search: search || undefined,
        sortKey: sorting?.id,
        sortValue: sorting?.desc ? "desc" : "asc",
      },
    },
  );

  return response.data;
};
