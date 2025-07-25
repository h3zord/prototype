import { api } from "../../config/api";

interface RoutePermission {
  route: string;
}

interface Group {
  id: number;
  name: string;
  permissions: string[];
  routePermissions: RoutePermission[];
  hiddenProperties: Record<string, unknown>;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isApprover: boolean;
  groupId: number;
  customerId: number;
  createdAt: string;
  updatedAt: string;
  group: Group;
}

export const fetchUser = async (): Promise<User> => {
  const response = await api.get<User>("/user/me");
  return response.data;
};
