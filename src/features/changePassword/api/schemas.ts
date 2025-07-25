import { z } from "zod";

export const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(12, { message: "A senha deve possuir pelo menos 12 caracteres" })
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
      "A senha deve possuir uma letra maiúscula, uma letra minúscula e um número",
    ),
});

export type ChangePasswordInputSchema = z.infer<typeof changePasswordSchema>;
