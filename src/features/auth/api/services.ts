import { apiPublic } from "../../../config/api";
import { LoginInputSchema } from "./schemas";

export const loginService = async (
  input: LoginInputSchema,
): Promise<{ redirectTo?: string }> => {
  const body = {
    email: input.email,
    password: input.password,
    rememberMe: input.rememberMe,
  };

  const response = await apiPublic.post("auth/login", body);
  return response.data;
};
