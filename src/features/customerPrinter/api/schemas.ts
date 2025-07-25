import { z } from "zod";
import { PrinterTypeBack } from "../../../types/models/customerprinter";

const optionSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const optionSchemaNumber = z.object({
  value: z.number(),
  label: z.string().min(1),
});

const basePrinterSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  colorsAmount: z.preprocess(
    (val) => (val === "" ? NaN : val),
    z.coerce.number({
      required_error: "A quantidade de cores é obrigatória.",
      invalid_type_error: "A quantidade de cores é obrigatória.",
    }),
  ),
  trap: z.preprocess(
    (val) => (val === "" ? NaN : val),
    z.coerce.number({
      required_error: "Trap é obrigatório.",
      invalid_type_error: "Trap é obrigatório.",
    }),
  ),
  lineatures: z.array(optionSchema).min(1, "As lineaturas são obrigatórias."),
  thicknesses: z.array(optionSchema).min(1, "As espessuras são obrigatórias."),
  dotTypes: z.array(optionSchema).min(1, "Os tipos de ponto são obrigatórios."),
  curves: z.array(optionSchemaNumber).min(1, "As curvas são obrigatórias."),
  angles: z.array(optionSchema).min(1, "Os ângulos são obrigatórios."),
});

export const corrugatedPrinterSchema = basePrinterSchema.extend({
  type: z.literal(PrinterTypeBack.CORRUGATED_PRINTER),
  corrugatedPrinter: z.object({
    variation: z.preprocess(
      (val) => (val === "" ? NaN : val),
      z.coerce.number({
        required_error: "A variação é obrigatória.",
        invalid_type_error: "A variação é obrigatória.",
      }),
    ),
    flap: z
      .object(
        {
          value: z.string(),
          label: z.string(),
        },
        { required_error: "O campo LAP(orelha) é obrigatório." },
      )
      .nullable()
      .refine((value) => value !== null, {
        message: "O campo LAP(orelha) é obrigatório.",
      }),
    channelMinimum: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.coerce.number().optional(),
    ),
    channels: z.array(optionSchemaNumber),
  }),
});

const narrowWebPrinterSchema = basePrinterSchema.extend({
  type: z.literal(PrinterTypeBack.NARROW_WEB_PRINTER),
});

const wideWebPrinterSchema = basePrinterSchema.extend({
  type: z.literal(PrinterTypeBack.WIDE_WEB_PRINTER),
});

export const printerSchema = z.discriminatedUnion("type", [
  corrugatedPrinterSchema,
  narrowWebPrinterSchema,
  wideWebPrinterSchema,
]);

export type PrinterSchema = z.infer<typeof printerSchema>;
export type PrinterSchemaCorrugated = z.infer<typeof corrugatedPrinterSchema>;
