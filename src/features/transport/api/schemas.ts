import { z } from "zod";
import { companySchema } from "../components/modals/components/schemas/companySchema";
import { individualSchema } from "../components/modals/components/schemas/individualSchema";
import { PersonType } from "../../../types/models/transport";

const addressSchema = z.object({
  postalCode: z.string().length(8, "CEP deve ter o formato XXXXX-XXX."),

  street: z.string().min(1, "Rua é obrigatória."),

  neighborhood: z.string().min(1, "Bairro é obrigatório."),

  number: z.string().min(1, "Número é obrigatório."),

  complement: z.string().optional(),

  city: z.string().min(1, "Cidade é obrigatória."),

  state: z.string().min(1, "Estado é obrigatório."),
});

export const upsertTransportSchema = z.discriminatedUnion("personType", [
  z.object({
    personType: z.literal(PersonType.INDIVIDUAL),
    address: addressSchema,
    transportData: individualSchema,
  }),

  z.object({
    personType: z.literal(PersonType.COMPANY),
    address: addressSchema,
    transportData: companySchema,
  }),
]);

export type UpsertTransportSchema = z.infer<typeof upsertTransportSchema>;

export const upsertTransportSchemaAlternative = z
  .object({
    personType: z.enum([PersonType.INDIVIDUAL, PersonType.COMPANY], {
      errorMap: () => ({
        message: "O tipo de pessoa deve ser 'individual' ou 'company'.",
      }),
    }),
    address: addressSchema,
    transportData: z.object({
      cpfCnpj: z.string(),
      ie: z.string().optional(),
      name: z.string().optional(),
      fantasyName: z.string(),
      phone: z.string(),
      financialEmail: z.string(),
      unit: z.object({
        value: z.string(),
        label: z.string(),
      }),
    }),
  })
  .refine(
    (data) => {
      if (data.personType === PersonType.INDIVIDUAL) {
        return individualSchema.safeParse(data.transportData).success;
      } else {
        return companySchema.safeParse(data.transportData).success;
      }
    },
    {
      message:
        "Dados de transporte inválidos para o tipo de pessoa selecionado",
      path: ["transportData"],
    },
  );
