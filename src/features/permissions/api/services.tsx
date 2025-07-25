import { api } from "../../../config/api";

export type GetGroupsResponse = {
  id: number;
  name: string;
}[];

export type GroupWithPermissions = {
  id: number;
  name: string;
  routes: string[];
  permissions: string[];
  redirectRoute?: string;
  defaultFilters?: any; // JSON object from backend
};

export type UpdateGroupRoutesParams = {
  groupId: number;
  routes: string[];
};

export type UpdateGroupPermissionsParams = {
  groupId: number;
  permissions: string[];
};

export type UpdateGroupRedirectSettingsParams = {
  groupId: number;
  redirectRoute: string;
  defaultFilters: any | null;
};

export const getGroupsWithRoutes = async (): Promise<
  GroupWithPermissions[]
> => {
  const response = await api.get("/permissions/list");
  return response.data;
};

export const updateGroupRoutes = async (
  params: UpdateGroupRoutesParams
): Promise<any> => {
  const response = await api.put("/permissions/update-routes", params);
  return response.data;
};

export const updateGroupPermissions = async (
  params: UpdateGroupPermissionsParams
): Promise<any> => {
  const response = await api.put("/permissions/update-permissions", params);
  return response.data;
};

export const updateGroupRedirectSettings = async (
  params: UpdateGroupRedirectSettingsParams
): Promise<any> => {
  const response = await api.put(
    "/permissions/update-redirect-settings",
    params
  );
  return response.data;
};
