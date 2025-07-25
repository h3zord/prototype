import { z } from "zod";

// Schema Zod para CreateServiceOrderInvoiceWithSelect
export const createServiceOrderInvoiceWithSelectSchema = z.object({
  nfNumber: z.string().min(1, "N° NF é obrigatório"),

  serialNumber: z.string().min(1, "Prefixo é obrigatório"),

  prefix: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .nullable()
    .optional(),

  serialOnly: z.string(),

  purchaseOrder: z.string().min(1, "Ordem de Compra é obrigatória"),

  invoiceDate: z.string().min(1, "Data de despacho é obrigatório"),

  billingDate: z.string(),

  shippingPrice: z.union([z.number(), z.string()]).refine((value) => {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }, "Frete é obrigatório"),

  otherPrice: z.union([z.number(), z.string()]).nullable().optional(),

  discount: z.union([z.number(), z.string()]).nullable().optional(),

  serviceOrders: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .min(1, "Adicione pelo menos 1 ordem de serviço."),
});

// Tipo TypeScript inferido do schema
export type CreateServiceOrderInvoiceWithSelectSchema = z.infer<
  typeof createServiceOrderInvoiceWithSelectSchema
>;
