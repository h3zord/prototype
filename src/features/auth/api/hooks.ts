import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import routes from "../../../routes/routes";
import { toast } from "react-toastify";
import { loginService } from "./services";
import { usePermission } from "../../../context/PermissionsRouterContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { fetchUserData } = usePermission();

  return useMutation({
    mutationFn: loginService,
    onSuccess: async (data) => {
      await fetchUserData();
      if (data.redirectTo) {
        navigate(data.redirectTo);
      } else {
        navigate(routes.HOME);
      }
    },
    onError: () => {
      toast.error("Email ou senha inválidos");
    },
  });
};
