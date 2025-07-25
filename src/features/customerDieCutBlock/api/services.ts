import { PaginationState, ColumnSort } from "@tanstack/react-table";
import { api } from "../../../config/api";
import { DieCutBlock } from "../../../types/models/cutomerdiecutblock";

export type UpsertDieCutBlockBody = {
  id?: number; // Opcional para criação
  distortion: number;
  cylinderId?: number;
};

export const createDieCutBlock = async (
  idCustomer: number,
  idPrinter: number,
  idCylinder: number,
  body: UpsertDieCutBlockBody,
): Promise<UpsertDieCutBlockBody> => {
  const response = await api.post(
    `/customer/${idCustomer}/printer/${idPrinter}/cylinder/${idCylinder}/diecutblock`,
    body,
  );
  return response.data;
};

export const editDieCutBlock = async ({
  idCustomer,
  idPrinter,
  idCylinder,
  id,
  body,
}: {
  idCustomer: number;
  idPrinter: number;
  idCylinder: number;
  id: number;
  body: UpsertDieCutBlockBody;
}): Promise<UpsertDieCutBlockBody> => {
  const response = await api.put(
    `/customer/${idCustomer}/printer/${idPrinter}/cylinder/${idCylinder}/diecutblock/${id}`,
    body,
  );
  return response.data;
};

export const deleteDieCutBlock = async ({
  idCustomer,
  idPrinter,
  idCylinder,
  id,
}: {
  idCustomer: number;
  idPrinter: number;
  idCylinder: number;
  id: number;
}): Promise<void> => {
  await api.delete(
    `/customer/${idCustomer}/printer/${idPrinter}/cylinder/${idCylinder}/diecutblock/${id}`,
  );
};

export type GetDieCutBlocksParams = {
  idCustomer: number;
  idPrinter: number;
  idCylinder: number;
  pagination: PaginationState;
  sorting: ColumnSort | undefined;
  search: string;
};

export type GetDieCutBlocksResponse = {
  idCustomer: number;
  data: DieCutBlock[];
  page: number;
  totalCount: number;
};

export const getDieCutBlocks = async ({
  idCustomer,
  idPrinter,
  idCylinder,
  pagination,
  search,
  sorting,
}: GetDieCutBlocksParams): Promise<GetDieCutBlocksResponse> => {
  const response = await api.get(
    `/customer/${idCustomer}/printer/${idPrinter}/cylinder/${idCylinder}/diecutblock`,
    {
      params: {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        search: search || undefined,
        sortKey: sorting?.id,
        sortValue:
          sorting?.desc === undefined
            ? undefined
            : sorting.desc
              ? "desc"
              : "asc",
      },
    },
  );

  return response.data;
};
