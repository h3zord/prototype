import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, InputLabelUp, ShowPassword } from "../../../components";
import { changePasswordSchema } from "../api/schemas";
import { useChangePassword } from "../api/hooks";
import easyflow from "../../../assets/images/logo_easyflow_branco.svg";
import { zodResolver } from "@hookform/resolvers/zod";

interface ChangePasswordFormData {
  newPassword: string;
}

const ChangePasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: changePassword } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center w-full h-svh">
      <div className="container rounded-lg p-14 bg-gray-700 max-w-md">
        <img src={easyflow} alt="easyflow" className="pb-4 mx-auto" />
        <p className="text-white text-center text-2xl font-semibold leading-snug mb-4">
          Trocar Senha
        </p>
        <p className="text-white text-center text-base leading-snug mb-6">
          Informe uma nova senha para sua conta.
        </p>
        <form
          onSubmit={handleSubmit(async (data) => changePassword(data))}
          className="flex flex-col space-y-4"
        >
          <InputLabelUp
            label="Nova Senha"
            type={showPassword ? "text" : "password"}
            register={register("newPassword")}
            error={errors.newPassword}
            placeholder="Digite a nova senha"
            endIcon={
              <Button
                type="button"
                onClick={toggleShowPassword}
                className="bg-transparent text-white p-2 border-0 outline-none focus:outline-none"
              >
                <ShowPassword showPassword={showPassword} />
              </Button>
            }
          />
          <Button type="submit" loading={isSubmitting}>
            Atualizar Senha
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
