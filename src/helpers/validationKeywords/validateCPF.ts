import { z } from "zod";

/**
 * Valida se o CPF é válido com base nos dígitos verificadores
 */
function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calc = (factor: number) =>
    cpf
      .slice(0, factor - 1)
      .split("")
      .reduce((sum, num, idx) => sum + parseInt(num, 10) * (factor - idx), 0);

  const digit1 = calc(10) % 11 < 2 ? 0 : 11 - (calc(10) % 11);
  const digit2 = calc(11) % 11 < 2 ? 0 : 11 - (calc(11) % 11);

  return parseInt(cpf[9], 10) === digit1 && parseInt(cpf[10], 10) === digit2;
}

/**
 * Zod schema que:
 * - Transforma: remove caracteres não numéricos do CPF
 * - Valida: garante que o CPF seja válido
 */
export const validateCPFKeyword = z
  .string()
  .transform((val) => val.replace(/\D/g, "")) // Normaliza
  .refine((val) => isValidCPF(val), {
    message: "CPF inválido",
  });
