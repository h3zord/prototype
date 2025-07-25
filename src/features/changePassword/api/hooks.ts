import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import routes from "../../../routes/routes";
import { changePasswordService } from "./services";

export const useChangePassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: changePasswordService,
    onSuccess: () => {
      toast.success("Senha alterada com sucesso");
      navigate(routes.LOGIN);
    },
    onError: () => {
      toast.error("Erro ao alterar a senha");
    },
  });
};
