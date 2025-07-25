import {
  useQuery,
  UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  UpsertServiceOrderInvoiceBody,
  GetInvoicesParams,
  GetInvoicesResponse,
  createServiceOrderInvoice,
  getInvoices,
  updateServiceOrderInvoice,
  UpdateServiceOrderInvoiceRequest,
  DeleteInvoiceRequest,
  deleteInvoice,
  getInvoiceNumbersList,
} from "./services";
import { UseCustomMutationParams } from "../../../config/queryClient";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const useInvoices = (
  params: GetInvoicesParams,
  options?: Omit<
    UseQueryOptions<GetInvoicesResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => getInvoices(params),
    meta: { ERROR_MESSAGE: "Erro ao buscar notas fiscais" },
    ...options,
  });
};

export const useCreateServiceOrderInvoice = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<any, Error, UpsertServiceOrderInvoiceBody> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServiceOrderInvoice,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      queryClient.invalidateQueries({ queryKey: ["DeliveriesOfTheDay"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onSuccess?.(data, ...args);
    },
    onError: (error: AxiosError<any>) => {
      const message =
        error.response?.data?.message || "Erro ao criar nota fiscal";
      toast.error(message);
    },
    meta: {
      // ERROR_MESSAGE: "Erro ao criar nota fiscal",
      SUCCESS_MESSAGE: "Nota fiscal criada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useCreateDraftInvoice = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<any, Error, UpsertServiceOrderInvoiceBody> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServiceOrderInvoice,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      queryClient.invalidateQueries({ queryKey: ["invoiceServiceOrder"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onSuccess?.(data, ...args);
    },
    onError: (error: AxiosError<any>) => {
      const message =
        error.response?.data?.message || "Erro ao criar pré-nota fiscal";
      toast.error(message);
    },
    meta: {
      SUCCESS_MESSAGE: "Pré-nota fiscal criada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useUpdateServiceOrderInvoice = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  any,
  Error,
  UpdateServiceOrderInvoiceRequest
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateServiceOrderInvoice,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar nota fiscal",
      SUCCESS_MESSAGE: "Nota fiscal atualizada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useDeleteInvoice = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<void, Error, DeleteInvoiceRequest> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao deletar nota fiscal",
      SUCCESS_MESSAGE: "Nota fiscal removida com sucesso!",
    },
    ...mutationConfig,
  });
};

export interface GetInvoiceNumbersResponse {
  id: string;
  number: string;
}

export const useInvoiceNumbersList = (
  query?: { serviceOrderId?: string },
  options?: Omit<
    UseQueryOptions<GetInvoiceNumbersResponse[], unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["invoiceNumbers", query],
    queryFn: () => getInvoiceNumbersList(query),
    ...options,
  });
};
