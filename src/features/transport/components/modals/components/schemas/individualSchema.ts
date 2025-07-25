import { z } from "zod";

function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let rev = 11 - (sum % 11);
  const digit1 = rev >= 10 ? 0 : rev;

  if (digit1 !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }

  rev = 11 - (sum % 11);
  const digit2 = rev >= 10 ? 0 : rev;

  return digit2 === parseInt(cpf.charAt(10));
}

export const individualSchema = z.object({
  cpfCnpj: z
    .string()
    .min(1, { message: "O CPF é obrigatório." })
    .transform((val) => val.replace(/[^\d]/g, ""))
    .refine((val) => val.length === 11, {
      message: "CPF deve conter 11 dígitos.",
    })
    .refine((val) => isValidCPF(val), {
      message: "CPF inválido.",
    }),

  fantasyName: z
    .string()
    .min(1, { message: "O nome é obrigatório." })
    .refine((val: string) => val.length >= 3, {
      message: "Digite um nome válido.",
    }),

  phone: z
    .string()
    .min(10, "Telefone deve conter 10 ou 11 digitos.")
    .max(11, "Telefone deve conter 10 ou 11 digitos."),

  financialEmail: z
    .string()
    .min(1, { message: "O e-mail é obrigatório." })
    .email({ message: "Digite um e-mail válido." }),

  unit: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .nullable()
    .refine((data) => data !== null && data.value && data.label, {
      message: "Selecione uma opção.",
    }),
});

export type IndividualSchema = z.infer<typeof individualSchema>;
