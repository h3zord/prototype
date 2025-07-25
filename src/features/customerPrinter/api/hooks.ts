import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  createPrinter,
  deletePrinter,
  editPrinter,
  getPrinters,
  UpsertPrinterBody,
  GetPrintersParams,
  GetPrintersResponse,
  GetPrinterParams,
  GetPrinterResponse,
  getPrinter,
  type Channel,
  type CreateChannelBody,
  createChannel,
  type UpdateChannelBody,
  updateChannel,
  deleteChannel,
  getChannels,
  type Curve,
  type CreateCurveBody,
  createCurve,
  type UpdateCurveBody,
  updateCurve,
  deleteCurve,
  getCurves,
} from "./services";
import { UseCustomMutationParams } from "../../../config/queryClient";

export const usePrinter = (
  params: GetPrinterParams,
  options?: Omit<
    UseQueryOptions<GetPrinterResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  const { idCustomer, idPrinter } = params;

  return useQuery({
    queryKey: ["printer", idCustomer, idPrinter],
    queryFn: () => getPrinter({ idCustomer, idPrinter }),
    enabled: !!idCustomer && !!idPrinter,
    ...options,
  });
};

export const usePrinters = (
  params: GetPrintersParams,
  options?: Omit<
    UseQueryOptions<GetPrintersResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  const { idCustomer, ...restParams } = params;

  return useQuery({
    queryKey: ["printers", idCustomer, params],
    queryFn: () => getPrinters({ idCustomer, ...restParams }),
    ...options,
  });
};

export const useCreatePrinter = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  UpsertPrinterBody,
  Error,
  { idCustomer: number; body: UpsertPrinterBody }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idCustomer, body }) => createPrinter(idCustomer, body),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["printers", args[0]?.idCustomer],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar Impressora",
      SUCCESS_MESSAGE: "Impressora criada com sucesso!",
    },
    ...mutationConfig,
  });
};

// Channel Hooks
export const useChannels = (options?: UseQueryOptions<Channel[], Error>) => {
  return useQuery({
    queryKey: ["channels"],
    queryFn: getChannels,
    ...options,
  });
};

export const useCreateChanel = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  Channel,
  Error,
  { body: CreateChannelBody }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body }) => createChannel(body),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar Calha",
      SUCCESS_MESSAGE: "Calha criada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useUpdateChannel = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  Channel,
  Error,
  { id: number; body: UpdateChannelBody }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }) => updateChannel(id, body),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar Calha",
      SUCCESS_MESSAGE: "Calha atualizada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useDeleteChannel = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<Channel, Error, { id: number }> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => deleteChannel(id),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao remover Calha",
      SUCCESS_MESSAGE: "Calha removida com sucesso!",
    },
    ...mutationConfig,
  });
};

// Curve Hooks
export const useCurves = (options?: UseQueryOptions<Curve[], Error>) => {
  return useQuery({
    queryKey: ["curves"],
    queryFn: getCurves,
    ...options,
  });
};

export const useCreateCurve = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<Curve, Error, { body: CreateCurveBody }> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body }) => createCurve(body),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["curves"],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar Curva",
      SUCCESS_MESSAGE: "Curva criada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useUpdateCurve = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  Curve,
  Error,
  { id: number; body: UpdateCurveBody }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }) => updateCurve(id, body),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["curves"],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar Curva",
      SUCCESS_MESSAGE: "Curva atualizada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useDeleteCurve = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<Curve, Error, { id: number }> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => deleteCurve(id),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["curves"],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao remover Curva",
      SUCCESS_MESSAGE: "Curva removida com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useEditPrinter = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  UpsertPrinterBody,
  Error,
  { idCustomer: number; id: number; body: UpsertPrinterBody }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editPrinter,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["printers", args[0]?.idCustomer],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar Impressora",
      SUCCESS_MESSAGE: "Impressora atualizada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useDeletePrinter = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  void,
  Error,
  { idCustomer: number; id: number }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePrinter,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["printers", args[0]?.idCustomer],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao deletar Impressora",
      SUCCESS_MESSAGE: "Impressora deletada com sucesso!",
    },
    ...mutationConfig,
  });
};
