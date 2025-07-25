import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z
    .string()
    .min(12, { message: "A senha deve possuir pelo menos 12 caracteres" })
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
      "A senha deve possuir uma letra maiúscula, uma letra minúscula e um número",
    ),
  rememberMe: z.boolean(),
});

export type LoginInputSchema = z.infer<typeof loginSchema>;
