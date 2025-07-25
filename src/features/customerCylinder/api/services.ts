import { api } from "../../../config/api";
import { ColumnSort, PaginationState } from "@tanstack/react-table";
import { Cylinder } from "../../../types/models/customercylinder";

export type UpsertCylinderBody = {
  id?: number;
  cylinder: number;
  polyesterMaxHeight: number;
  polyesterMaxWidth: number;
  clicheMaxWidth?: number | null;
  clicheMaxHeight?: number | null;
  distortion: number;
  dieCutBlockDistortion?: number | null;
};

export type GetCylindersParams = {
  idCustomer: number;
  idPrinter: number;
  pagination: PaginationState;
  sorting: ColumnSort | undefined;
  search: string;
};

export type GetCylindersResponse = {
  idCustomer: number;
  idPrinter: number;
  data: Cylinder[];
  totalCount: number;
};

// Serviço para listar cilindros
export const getCylinders = async ({
  idCustomer,
  idPrinter,
  pagination,
  search,
  sorting,
}: GetCylindersParams): Promise<GetCylindersResponse> => {
  const response = await api.get(
    `customer/${idCustomer}/printer/${idPrinter}/cylinder`,
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

// Serviço para criar um novo cilindro
export const createCylinder = async (
  idCustomer: number,
  idPrinter: number,
  body: UpsertCylinderBody,
): Promise<Cylinder> => {
  const response = await api.post(
    `customer/${idCustomer}/printer/${idPrinter}/cylinder`,
    body,
  );
  return response.data;
};

// Serviço para editar um cilindro existente
export const editCylinder = async ({
  idCustomer,
  idPrinter,
  idCylinder,
  body,
}: {
  idCustomer: number;
  idPrinter: number;
  idCylinder: number; // Renomeado para manter consistência com o hook
  body: UpsertCylinderBody;
}): Promise<Cylinder> => {
  const response = await api.put(
    `customer/${idCustomer}/printer/${idPrinter}/cylinder/${idCylinder}`,
    body,
  );
  return response.data;
};

// Serviço para deletar um cilindro
export const deleteCylinder = async ({
  idCustomer,
  idPrinter,
  id,
}: {
  idCustomer: number;
  idPrinter: number;
  id: number;
}): Promise<void> => {
  const response = await api.delete(
    `customer/${idCustomer}/printer/${idPrinter}/cylinder/${id}`,
  );
  return response.data;
};
