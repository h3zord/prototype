import { z } from "zod";

export const cylinderSchema = z.object({
  cylinder: z.preprocess(
    (val) => (val === "" ? NaN : val),
    z.coerce.number({
      required_error: "O cilindro é obrigatório.",
      invalid_type_error: "O cilindro é obrigatório.",
    }),
  ),
  polyesterMaxHeight: z.preprocess(
    (val) => (val === "" ? NaN : val),
    z.coerce.number({
      required_error: "A altura máxima do poliester é obrigatória.",
      invalid_type_error: "A altura máxima do poliester é obrigatória.",
    }),
  ),
  polyesterMaxWidth: z.preprocess(
    (val) => (val === "" ? NaN : val),
    z.coerce.number({
      required_error: "A largura máxima do poliester é obrigatória.",
      invalid_type_error: "A largura máxima do poliester é obrigatória.",
    }),
  ),
  clicheMaxWidth: z.preprocess(
    (val) => (val === "" ? NaN : val),
    z.coerce.number({
      required_error: "A largura máxima do clichê é obrigatória.",
      invalid_type_error: "A largura máxima do clichê é obrigatória.",
    }),
  ),
  clicheMaxHeight: z.preprocess(
    (val) => (val === "" ? NaN : val),
    z.coerce.number({
      required_error: "A altura máxima do clichê é obrigatória.",
      invalid_type_error: "A altura máxima do clichê é obrigatória.",
    }),
  ),
  distortion: z.preprocess(
    (val) => (val === "" ? NaN : val),
    z.coerce.number({
      required_error: "A distorção do clichê é obrigatória.",
      invalid_type_error: "A distorção do clichê é obrigatória.",
    }),
  ),
  dieCutBlockDistortion: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce
      .number({
        invalid_type_error: "A distorção do faca deve ser um número.",
      })
      .optional(),
  ),
});

export type CylinderSchema = z.infer<typeof cylinderSchema>;
