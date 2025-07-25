import { z } from "zod";

/**
 * Valida se o valor string representa um número entre 1 e 1000
 * Aceita formatos como "9", "9,9", "9,99", "99,99"
 */
export const trapSchema = z.string().refine(
  (value) => {
    const normalized = value.replace(",", ".");
    const numericValue = parseFloat(normalized);

    return !isNaN(numericValue) && numericValue >= 1 && numericValue <= 1000;
  },
  {
    message: "O valor deve estar entre 1 e 1000",
  },
);
