import { ColumnSort, PaginationState } from "@tanstack/react-table";
import { User } from "../../../types/models/user";
import { api } from "../../../config/api";
import type { PermissionType } from "../../../features/permissions/permissionsTable";
import type { Group } from "../../../types/models/group";

export type GetUsersParams = {
  pagination: PaginationState;
  sorting?: ColumnSort;
  search?: string;
};

export type GetUsersResponse = {
  data: User[];
  page: number;
  totalCount: number;
};

export const getUsers = async ({
  pagination,
  search,
  sorting,
}: GetUsersParams): Promise<GetUsersResponse> => {
  const response = await api.get("user", {
    params: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      search: search,
      sortKey: sorting?.id,
      sortValue:
        sorting?.desc === undefined ? undefined : sorting.desc ? "desc" : "asc",
    },
  });
  return response.data;
};

export type GetUsersListResponse = User[];

export const getUsersList = async (query?: {
  group: string[];
}): Promise<GetUsersListResponse> => {
  const response = await api.get("user/list", {
    params: query?.group.length
      ? {
          group: query?.group,
        }
      : [],
  });
  return response.data;
};

export type CreateUserBody = {
  email: string;
  firstName: string;
  lastName: string;
  customerId: number;
  groupId: number;
  isApprover: boolean;
  password: string;
};

export const createUser = async (body: CreateUserBody): Promise<User> => {
  const response = await api.post("user", body);

  return response.data;
};

export type EditUserBody = {
  email: string;
  firstName: string;
  lastName: string;
  customerId: number;
  groupId: number;
  isApprover: boolean;
};
export type EditUserRequest = { id: number; body: EditUserBody };

export const editUser = async ({
  id,
  body,
}: EditUserRequest): Promise<User> => {
  const response = await api.put(`user/${id}`, body);

  return response.data;
};

export type DeleteUserRequest = { id: number };

export const deleteUser = async ({ id }: DeleteUserRequest): Promise<void> => {
  const response = await api.delete(`user/${id}`);

  return response.data;
};

export type GetGroupsParams = {
  pagination: PaginationState;
  sorting?: ColumnSort;
  search?: string;
};

export type GetGroupsResponse = {
  data: Group[];
  page: number;
  totalCount: number;
};

export const getGroups = async ({
  pagination,
  search,
  sorting,
}: GetGroupsParams): Promise<GetGroupsResponse> => {
  const response = await api.get("groups", {
    params: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      search: search,
      sortKey: sorting?.id,
      sortValue:
        sorting?.desc === undefined ? undefined : sorting.desc ? "desc" : "asc",
    },
  });
  return response.data;
};

export type GetGroupsListResponse = Group[];

export const getGroupsList = async (): Promise<GetGroupsListResponse> => {
  const response = await api.get("group/list");
  return response.data;
};

export type CreateGroupBody = {
  name: string;
  permissions: PermissionType[];
  hiddenProperties?: Record<string, string[]>;
};

export const createGroup = async (body: CreateGroupBody): Promise<Group> => {
  const response = await api.post("group", body);
  return response.data;
};

export type EditGroupBody = {
  name: string;
  permissions: PermissionType[];
  hiddenProperties?: Record<string, string[]>;
};

export type EditGroupRequest = { id: number; body: EditGroupBody };

export const editGroup = async ({
  id,
  body,
}: EditGroupRequest): Promise<Group> => {
  const response = await api.put(`group/${id}`, body);
  return response.data;
};

export type DeleteGroupRequest = { id: number };

export const deleteGroup = async ({
  id,
}: DeleteGroupRequest): Promise<void> => {
  const response = await api.delete(`group/${id}`);
  return response.data;
};
