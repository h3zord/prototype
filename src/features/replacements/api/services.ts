import { ColumnSort, PaginationState } from "@tanstack/react-table";
import { api } from "../../../config/api";
import { ServiceOrderStatus } from "../../../types/models/serviceorder";

export type GetReplacementsParams = {
  pagination: PaginationState;
  sorting: ColumnSort | undefined;
  search: string;
  filters: any;
  statuses?: ServiceOrderStatus[];
};

export type GetReplacementsResponse = {
  data: any[];
  totalCount: number;
};

export const getReplacements = async ({
  pagination,
  search,
  sorting,
  filters,
  statuses,
}: GetReplacementsParams): Promise<GetReplacementsResponse> => {
  const fixedFilters = {
    ...filters,
    productType: "REPLACEMENT",
  };

  const response = await api.get("serviceorder", {
    params: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      search,
      ...fixedFilters,
      statuses,
      sortKey: sorting?.id,
      sortValue:
        sorting?.desc === undefined ? undefined : sorting.desc ? "desc" : "asc",
    },
  });

  return response.data;
};
