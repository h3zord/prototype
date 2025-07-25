import { api } from "../../../config/api";

export const changePasswordService = async (input: { newPassword: string }) => {
  const response = await api.post("/auth/changePassword", input);
  return response.data;
};
