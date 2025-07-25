import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import easyflow from "../../../assets/images/logo_easyflow_branco.svg";
import {
  Button,
  Checkbox,
  InputLabelUp,
  ShowPassword,
} from "../../../components";
import { useLogin } from "../api/hooks";
import { loginSchema } from "../api/schemas";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutate: login } = useLogin();

  return (
    <div className="flex justify-center items-center w-full h-svh">
      <div className="container rounded-lg p-14 bg-gray-700 max-w-md">
        <img src={easyflow} alt="easyflow" className="pb-4" />
        <form
          onSubmit={handleSubmit(async (data) => login(data))}
          className="flex flex-col space-y-4"
        >
          <InputLabelUp
            label="E-mail"
            type="text"
            register={register("email")}
            placeholder="exemplo@empresa.com"
            error={errors.email}
          />
          <InputLabelUp
            label="Senha"
            type={showPassword ? "text" : "password"}
            register={register("password")}
            error={errors.password}
            placeholder="Digite a senha"
            endIcon={
              <Button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="bg-transparent text-white p-2 border-0 outline-none focus:outline-none"
              >
                {<ShowPassword showPassword={showPassword} />}
              </Button>
            }
          />
          <Checkbox label="Lembrar de mim" register={register("rememberMe")} />
          <Button type="submit" loading={isLoading}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
