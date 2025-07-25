import { ColumnSort, PaginationState } from "@tanstack/react-table";
import { api } from "../../../config/api";

export type GetInvoicedServiceOrdersParams = {
  pagination: PaginationState;
  sorting: ColumnSort | undefined;
  search: string;
  filters: any;
};

export type GetInvoicedServiceOrdersResponse = {
  data: any[];
  totalCount: number;
};

export const getInvoicedServiceOrders = async ({
  pagination,
  search,
  sorting,
  filters,
}: GetInvoicedServiceOrdersParams): Promise<GetInvoicedServiceOrdersResponse> => {
  const response = await api.get("serviceorder/invoiced", {
    params: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      search,
      filters,
      sortKey: sorting?.id,
      sortValue:
        sorting?.desc === undefined ? undefined : sorting.desc ? "desc" : "asc",
    },
  });

  return response.data;
};
