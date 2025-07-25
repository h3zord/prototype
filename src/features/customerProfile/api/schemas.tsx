import { z } from "zod";

const optionSchema = z.object({
  value: z.string({ required_error: "Selecione uma opção" }),
  label: z.string(),
});

const optionSchemaNumber = z.object({
  value: z.number({ required_error: "Selecione uma opção" }),
  label: z.string(),
});

const colorSchema = z.object({
  cliche: z.boolean().optional(),
  tint: optionSchema.nullable().refine(Boolean, {
    message: "Selecione uma tinta",
  }),
  lineature: optionSchema.nullable().refine(Boolean, {
    message: "Selecione uma lineatura",
  }),
  curve: optionSchemaNumber.nullable().refine(Boolean, {
    message: "Selecione uma curva",
  }),
  angle: optionSchemaNumber.nullable().refine(Boolean, {
    message: "Selecione um ângulo",
  }),
  dotType: optionSchema.nullable().refine(Boolean, {
    message: "Selecione um ponto",
  }),
});

export const profilesSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  colors: z
    .array(colorSchema)
    .min(1, { message: "É necessário pelo menos uma cor" }),
});

export type ProfilesSchema = z.infer<typeof profilesSchema>;
