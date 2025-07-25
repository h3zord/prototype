import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  createProfile,
  deleteProfile,
  editProfile,
  getProfiles,
  UpsertProfileBody,
  GetProfileParams,
  GetProfileResponse,
} from "./services";
import { UseCustomMutationParams } from "../../../config/queryClient";

export const useProfiles = (
  params: GetProfileParams,
  options?: Omit<
    UseQueryOptions<GetProfileResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  const { idCustomer, idPrinter, ...restParams } = params;

  return useQuery({
    queryKey: ["profiles", idCustomer, idPrinter, params],
    queryFn: () =>
      getProfiles({
        idCustomer,
        idPrinter,
        ...restParams,
      }),
    ...options,
  });
};

export const useCreateProfile = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  UpsertProfileBody,
  Error,
  { idCustomer: number; idPrinter: number; body: UpsertProfileBody }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idCustomer, idPrinter, body }) =>
      createProfile(idCustomer, idPrinter, body),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["profiles", args[0]?.idCustomer],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar o Perfil",
      SUCCESS_MESSAGE: "Perfil criado com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useEditProfile = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  UpsertProfileBody,
  Error,
  { idCustomer: number; idPrinter: number; id: number; body: UpsertProfileBody }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idCustomer, idPrinter, id, body }) =>
      editProfile(idCustomer, idPrinter, id, body),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["profiles", args[0]?.idCustomer],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar o Perfil",
      SUCCESS_MESSAGE: "Perfil atualizado com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useDeleteProfile = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  void,
  Error,
  { idCustomer: number; idPrinter: number; id: number }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idCustomer, idPrinter, id }) =>
      deleteProfile(idCustomer, idPrinter, id),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["profiles", args[0]?.idCustomer],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao deletar o Perfil",
      SUCCESS_MESSAGE: "Perfil deletado com sucesso!",
    },
    ...mutationConfig,
  });
};
