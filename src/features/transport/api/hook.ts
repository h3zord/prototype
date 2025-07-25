import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  createTransport,
  deleteTransport,
  DeleteTransportRequest,
  editTransport,
  EditTransportRequest,
  getTransports,
  getTransportsList,
  GetTransportsListResponse,
  GetTransportsParams,
  GetTransportsResponse,
  UpsertTransportBody,
} from "./services";
import { UseCustomMutationParams } from "../../../config/queryClient";
import { Transport } from "../../../types/models/transport";

export const useTransports = (
  params: GetTransportsParams,
  options?: Omit<
    UseQueryOptions<GetTransportsResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["transports", params],
    queryFn: () => getTransports(params),
    ...options,
  });
};

export const useCreateTransport = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<Transport, Error, UpsertTransportBody> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransport,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["transports"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar transporte",
      SUCCESS_MESSAGE: "Transporte criado com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useEditTransport = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<Transport, Error, EditTransportRequest> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTransport,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["transports"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar transporte",
      SUCCESS_MESSAGE: "Transporte atualizado com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useDeleteTransport = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<void, Error, DeleteTransportRequest> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransport,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["transports"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao deletar transporte",
      SUCCESS_MESSAGE: "Transporte removido com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useTransportsList = (
  options?: Omit<
    UseQueryOptions<GetTransportsListResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["transports", "list"],
    queryFn: () => getTransportsList(),
    ...options,
  });
};
