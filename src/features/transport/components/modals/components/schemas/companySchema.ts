import { z } from "zod";

function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let size = 12;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += +numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== +digits.charAt(0)) return false;

  size = 13;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += +numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === +digits.charAt(1);
}

export const companySchema = z.object({
  cpfCnpj: z
    .string()
    .min(1, { message: "O CNPJ é obrigatório." })
    .transform((val) => val.replace(/[^\d]/g, ""))
    .refine((val) => val.length === 14, {
      message: "O CNPJ deve conter 14 dígitos.",
    })
    .refine((val) => isValidCNPJ(val), {
      message: "CNPJ inválido.",
    }),

  ie: z
    .string()
    .min(1, { message: "A Inscrição Estadual é obrigatória." })
    .refine((val: string) => val.length >= 9 && val.length <= 14, {
      message: "Digite uma Inscrição Estadual válida.",
    }),

  name: z
    .string()
    .min(1, { message: "O nome é obrigatório." })
    .refine((val: string) => val.length >= 3, {
      message: "Digite um nome válido.",
    }),

  fantasyName: z
    .string()
    .min(1, { message: "O nome Fantasia é obrigatório." })
    .refine((val: string) => val.length >= 3, {
      message: "Digite um nome fantasia válido.",
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

export type CompanySchema = z.infer<typeof companySchema>;
