import { ColumnSort, PaginationState } from "@tanstack/react-table";
import { api } from "../../../config/api";

export type GetPurchaseOrdersParams = {
  pagination: PaginationState;
  sorting: ColumnSort | undefined;
  search: string;
};

export type GetPurchaseOrdersResponse = {
  data: {
    id: number;
    purchaseOrder: string;
    serviceOrders: number[];
    invoices: number[];
    customer: {
      id: number;
      name: string;
      fantasyName: string | null;
      cpfCnpj: string;
    };
  }[];
  totalCount: number;
};

export const getPurchaseOrder = async ({
  pagination,
  search,
  sorting,
}: GetPurchaseOrdersParams): Promise<GetPurchaseOrdersResponse> => {
  const response = await api.get("serviceorder/purchaseOrder", {
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
