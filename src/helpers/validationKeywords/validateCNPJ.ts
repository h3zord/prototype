import { z } from "zod";

/**
 * Verifica se um CNPJ é válido
 */
function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, "");

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calcCheckDigit = (base: string, factors: number[]): number =>
    base
      .split("")
      .reduce((sum, num, idx) => sum + parseInt(num, 10) * factors[idx], 0) %
    11;

  const digit1 = (() => {
    const mod = calcCheckDigit(
      cnpj.slice(0, 12),
      [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );
    return mod < 2 ? 0 : 11 - mod;
  })();

  const digit2 = (() => {
    const mod = calcCheckDigit(
      cnpj.slice(0, 13),
      [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );
    return mod < 2 ? 0 : 11 - mod;
  })();

  return parseInt(cnpj[12], 10) === digit1 && parseInt(cnpj[13], 10) === digit2;
}

/**
 * Zod schema que:
 * - Transforma: remove caracteres não numéricos
 * - Valida: garante que o CNPJ seja válido
 */
export const validateCNPJKeyword = z
  .string()
  .transform((val) => val.replace(/\D/g, ""))
  .refine((val) => isValidCNPJ(val), {
    message: "CNPJ inválido",
  });
