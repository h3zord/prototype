import { api } from "../../../config/api";
import { Group } from "../../../types/models/group";

export type GetGroupsListResponse = Group[];

export const getGroupsList = async (): Promise<GetGroupsListResponse> => {
  const response = await api.get(`group/list`);
  return response.data;
};
