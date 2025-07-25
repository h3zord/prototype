import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  createCustomer,
  deleteCustomer,
  DeleteCustomerRequest,
  editCustomer,
  EditCustomerRequest,
  getCustomers,
  getCustomersList,
  GetCustomersListResponse,
  GetCustomersParams,
  GetCustomersResponse,
  UpsertStandardCustomerBody,
  UpsertExternalCustomerBody,
  createExternalCustomer,
  editExternalCustomer,
  EditExternalCustomerRequest,
  getCustomerById,
} from "./services";
import { UseCustomMutationParams } from "../../../config/queryClient";
import { Customer, CustomerType } from "../../../types/models/customer";

export const useCustomers = (
  params: GetCustomersParams,
  options?: Omit<
    UseQueryOptions<GetCustomersResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomers(params),
    ...options,
  });
};

export const useCreateCustomer = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  Customer,
  Error,
  UpsertStandardCustomerBody
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar cliente",
      SUCCESS_MESSAGE: "Cliente criado com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useCreateExternalCustomer = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  Customer,
  Error,
  UpsertExternalCustomerBody
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExternalCustomer,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar cliente",
      SUCCESS_MESSAGE: "Cliente criado com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useEditCustomer = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<Customer, Error, EditCustomerRequest> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editCustomer,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar cliente",
      SUCCESS_MESSAGE: "Cliente atualizado com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useEditExternalCustomer = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  Customer,
  Error,
  EditExternalCustomerRequest
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editExternalCustomer,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar cliente",
      SUCCESS_MESSAGE: "Cliente atualizado com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useDeleteCustomer = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<void, Error, DeleteCustomerRequest> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao deletar cliente",
      SUCCESS_MESSAGE: "Cliente removido com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useCustomersList = (
  query?: { type: CustomerType },
  options?: Omit<
    UseQueryOptions<GetCustomersListResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["customers", query],
    queryFn: () => getCustomersList(query),
    ...options,
  });
};

export const useGetCustomerById = (
  id: number,
  options?: Omit<UseQueryOptions<Customer, unknown>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
    ...options,
  });
};
