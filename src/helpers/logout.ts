import { NavigateFunction } from "react-router-dom";
import routes from "../routes/routes";
import { api } from "../config/api";

const logout = async (navigate: NavigateFunction) => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  } finally {
    navigate(routes.LOGIN);
  }
};

export default logout;
