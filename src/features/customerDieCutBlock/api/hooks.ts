import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  createDieCutBlock,
  deleteDieCutBlock,
  editDieCutBlock,
  getDieCutBlocks,
  UpsertDieCutBlockBody,
  GetDieCutBlocksParams,
  GetDieCutBlocksResponse,
} from "./services";
import { UseCustomMutationParams } from "../../../config/queryClient";

export const useDieCutBlocks = (
  params: GetDieCutBlocksParams,
  options?: Omit<
    UseQueryOptions<GetDieCutBlocksResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  const { idCustomer, idPrinter, idCylinder, ...restParams } = params;

  return useQuery({
    queryKey: ["diecutblocks", idCustomer, idPrinter, idCylinder, restParams],
    queryFn: () =>
      getDieCutBlocks({
        idCustomer,
        idPrinter,
        idCylinder,
        ...restParams,
      }),
    ...options,
  });
};

export const useCreateDieCutBlock = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  UpsertDieCutBlockBody,
  Error,
  {
    idCustomer: number;
    idPrinter: number;
    idCylinder: number;
    body: UpsertDieCutBlockBody;
  }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idCustomer, idPrinter, idCylinder, body }) =>
      createDieCutBlock(idCustomer, idPrinter, idCylinder, body),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: [
          "diecutblocks",
          args[0]?.idCustomer,
          args[0]?.idPrinter,
          args[0]?.idCylinder,
        ],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar Faca",
      SUCCESS_MESSAGE: "Faca criada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useEditDieCutBlock = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  UpsertDieCutBlockBody,
  Error,
  {
    idCustomer: number;
    idPrinter: number;
    idCylinder: number;
    id: number;
    body: UpsertDieCutBlockBody;
  }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idCustomer, idPrinter, idCylinder, id, body }) =>
      editDieCutBlock({
        idCustomer,
        idPrinter,
        idCylinder,
        id,
        body,
      }),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: [
          "diecutblocks",
          args[0]?.idCustomer,
          args[0]?.idPrinter,
          args[0]?.idCylinder,
        ],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar Faca",
      SUCCESS_MESSAGE: "Faca atualizada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useDeleteDieCutBlock = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  void,
  Error,
  {
    idCustomer: number;
    idPrinter: number;
    idCylinder: number;
    id: number;
  }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idCustomer, idPrinter, idCylinder, id }) =>
      deleteDieCutBlock({ idCustomer, idPrinter, idCylinder, id }),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: [
          "diecutblocks",
          args[0]?.idCustomer,
          args[0]?.idPrinter,
          args[0]?.idCylinder,
        ],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao deletar Faca",
      SUCCESS_MESSAGE: "Faca deletada com sucesso!",
    },
    ...mutationConfig,
  });
};
