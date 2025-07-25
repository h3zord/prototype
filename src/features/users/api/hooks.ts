import {
  useQuery,
  UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getUsers,
  GetUsersParams,
  GetUsersResponse,
  createUser,
  editUser,
  deleteUser,
  CreateUserBody,
  EditUserRequest,
  DeleteUserRequest,
  getUsersList,
  GetUsersListResponse,
  type DeleteGroupRequest,
  deleteGroup,
  type EditGroupRequest,
  editGroup,
  createGroup,
  type CreateGroupBody,
  getGroupsList,
  getGroups,
  type GetGroupsListResponse,
  type GetGroupsResponse,
  type GetGroupsParams,
} from "./services";
import { User } from "../../../types/models/user";
import { UseCustomMutationParams } from "../../../config/queryClient";
import type { Group } from "../../../types/models/group";

export const useGroups = (
  params: GetGroupsParams,
  options?: Omit<
    UseQueryOptions<GetGroupsResponse, unknown>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["groups", params],
    queryFn: () => getGroups(params),
    meta: { ERROR_MESSAGE: "Erro ao buscar grupos" },
    ...options,
  });
};

export const useGroupsList = (
  options?: Omit<
    UseQueryOptions<GetGroupsListResponse, unknown>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["groups", "list"],
    queryFn: () => getGroupsList(),
    meta: { ERROR_MESSAGE: "Erro ao buscar lista de grupos" },
    ...options,
  });
};

export const useCreateGroup = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<Group, Error, CreateGroupBody> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar grupo",
      SUCCESS_MESSAGE: "Grupo criado com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useEditGroup = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<Group, Error, EditGroupRequest> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editGroup,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar grupo",
      SUCCESS_MESSAGE: "Grupo atualizado com sucesso!",
    },
    ...mutationConfig,
  });
};

// CORREÇÃO: Removido meta para evitar toasts automáticos duplicados
export const useDeleteGroup = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<void, Error, DeleteGroupRequest> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      onSuccess?.(data, ...args);
    },
    // meta removido - toasts serão controlados manualmente no componente
    ...mutationConfig,
  });
};

export const useUsers = (
  params: GetUsersParams,
  options?: Omit<
    UseQueryOptions<GetUsersResponse, unknown>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    meta: { ERROR_MESSAGE: "Erro ao buscar usuários" },
    ...options,
  });
};

export const useUsersList = (
  query?: { group: string[] },
  options?: Omit<
    UseQueryOptions<GetUsersListResponse, unknown>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["users", "list", query],
    queryFn: () => getUsersList(query),
    meta: { ERROR_MESSAGE: "Erro ao buscar lista de usuários" },
    ...options,
  });
};

// CORREÇÃO: Removido meta para evitar toasts automáticos duplicados
export const useCreateUser = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<User, Error, CreateUserBody> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.(data, ...args);
    },
    // meta removido - toasts serão controlados manualmente no componente
    ...mutationConfig,
  });
};

export const useEditUser = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<User, Error, EditUserRequest> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editUser,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar usuário",
      SUCCESS_MESSAGE: "Usuário atualizado com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useDeleteUser = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<void, Error, DeleteUserRequest> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao deletar usuário",
      SUCCESS_MESSAGE: "Usuário removido com sucesso!",
    },
    ...mutationConfig,
  });
};
