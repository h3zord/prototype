import { z } from "zod";

/**
 * Schema para validar se o valor é uma instância de `File`
 */
export const fileSchema = z.any().refine(
  (value) => {
    return typeof File !== "undefined" && value instanceof File;
  },
  {
    message: "O valor precisa ser um arquivo válido (File).",
  },
);
