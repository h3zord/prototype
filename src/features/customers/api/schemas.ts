import { z } from "zod";
import { Product } from "../../../types/models/customer";

// Regex para validação de email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Validação customizada de CNPJ
const validateCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/\D/g, "");

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calcCheckDigit = (base: string, factors: number[]): number => {
    return (
      base
        .split("")
        .reduce((sum, num, idx) => sum + parseInt(num, 10) * factors[idx], 0) %
      11
    );
  };

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
};

// Validação customizada de CPF
const validateCPF = (cpf: string) => {
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
};

// Schema para objeto com value e label
const selectSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const selectNumberSchema = z.object({
  value: z.number(),
  label: z.string(),
});

// Schema base para dados da empresa
const companyDataBaseSchema = z.object({
  cpfCnpj: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine(validateCNPJ, {
      message: "Informe um CNPJ válido.",
    }),
  ie: z.string().min(9).max(14, {
    message: "Inscrição Estadual deve conter de 9 a 14 digitos.",
  }),
  name: z.string().min(1, {
    message: "Nome da empresa é obrigatório.",
  }),
  fantasyName: z.string().min(1, {
    message: "Nome fantasia é obrigatório.",
  }),
  purposeOfPurchase: selectSchema.nullable(),
  phone: z
    .string()
    .min(10, "Telefone deve conter 10 ou 11 digitos.")
    .max(11, "Telefone deve conter 10 ou 11 digitos."),
  nfeEmail: z.string().min(1, {
    message: "E-mail da NFE é obrigatório.",
  }),
  financialEmail: z.string().min(1, {
    message: "E-mail financeiro é obrigatório.",
  }),
});

// Schema para endereço
const addressSchema = z.object({
  postalCode: z.string().length(8, {
    message: "CEP deve ter o formato XXXXX-XXX.",
  }),
  street: z.string().min(1, {
    message: "Rua é obrigatória.",
  }),
  neighborhood: z.string().min(1, {
    message: "Bairro é obrigatório.",
  }),
  number: z.string().min(1, {
    message: "Número é obrigatório.",
  }),
  complement: z.string(),
  city: z.string().min(1, {
    message: "Cidade é obrigatória.",
  }),
  state: z.string().min(1, {
    message: "Estado é obrigatório.",
  }),
});

// Schema para dados financeiros do cliente padrão
const financialDataSchema = z.object({
  company: selectSchema.nullable(),
  unit: selectSchema.nullable(),
  representative: selectNumberSchema.nullable(),
  creditAnalysis: selectSchema.nullable(),
  isVerified: z.boolean(),
  notes: z.string(),
  classification: selectSchema.nullable(),
  hasOwnStock: selectSchema.nullable(),
  customerSegment: z.array(selectSchema),
  clicheCorrugatedPrice: z.union([z.number(), z.string()]),
  clicheRepairPrice: z.union([z.number(), z.string()]),
  clicheReAssemblyPrice: z.union([z.number(), z.string()]).nullable(),
  dieCutBlockNationalPrice: z.union([z.number(), z.string()]),
  dieCutBlockImportedPrice: z.union([z.number(), z.string()]),
  easyflowPrice: z.union([z.number(), z.string()]),
  printingPrice: z.union([z.number(), z.string()]),
  profileProofIccPrice: z.union([z.number(), z.string()]),
  finalArtPrice: z.union([z.number(), z.string()]),
  imageProcessingPrice: z.union([z.number(), z.string()]),
  operatorCliche: selectNumberSchema.nullable(),
  operatorDieCutBlock: selectNumberSchema.nullable(),
  operatorImage: selectNumberSchema.nullable(),
  operatorReviewer: selectNumberSchema.nullable(),
  products: z.array(selectSchema).min(1, {
    message: "Adicione pelo menos 1 produto.",
  }),
  paymentTerm: z.array(z.number().min(7).max(90)).default([]),
});

// Schema para transporte
const transportSchema = z.object({
  transport: selectNumberSchema.nullable(),
  secondaryTransport: z.array(selectNumberSchema).default([]),
});

// Schema para dados complementares
const complementaryDataSchema = z.object({
  procedure: z.string().default(""),
});

// Schema principal para UpsertCustomer
export const upsertCustomerSchema = z
  .object({
    companyData: companyDataBaseSchema.extend({
      generalEmail: z.string(),
    }),
    address: addressSchema,
    financialData: financialDataSchema,
    transport: transportSchema,
    complementaryData: complementaryDataSchema,
  })
  .superRefine((data, ctx) => {
    // Validações condicionais baseadas nos produtos selecionados
    const priceConditions = [
      { key: "clicheCorrugatedPrice", enumVal: Product.CLICHE_CORRUGATED },
      { key: "clicheRepairPrice", enumVal: Product.CLICHE_REPAIR },
      { key: "clicheReAssemblyPrice", enumVal: Product.CLICHE_REASSEMBLY },
      {
        key: "dieCutBlockNationalPrice",
        enumVal: Product.DIECUTBLOCK_NATIONAL,
      },
      {
        key: "dieCutBlockImportedPrice",
        enumVal: Product.DIECUTBLOCK_IMPORTED,
      },
      { key: "easyflowPrice", enumVal: Product.EASYFLOW },
      { key: "printingPrice", enumVal: Product.PRINTING },
      { key: "profileProofIccPrice", enumVal: Product.PROFILE_PROOF_ICC },
      { key: "finalArtPrice", enumVal: Product.FINAL_ART },
      { key: "imageProcessingPrice", enumVal: Product.IMAGE_PROCESSING },
    ];

    priceConditions.forEach((condition) => {
      const hasProduct = data.financialData.products.some(
        (product) => product.value === condition.enumVal,
      );

      if (hasProduct) {
        const value =
          data.financialData[condition.key as keyof typeof data.financialData];
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Campo obrigatório.",
            path: ["financialData", condition.key],
          });
        }
      }
    });

    // Validações para campos obrigatórios
    if (!data.companyData.purposeOfPurchase) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção.",
        path: ["companyData", "purposeOfPurchase"],
      });
    }

    if (!data.financialData.company) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção.",
        path: ["financialData", "company"],
      });
    }

    if (!data.financialData.unit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção.",
        path: ["financialData", "unit"],
      });
    }

    if (!data.financialData.creditAnalysis) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção.",
        path: ["financialData", "creditAnalysis"],
      });
    }

    if (!data.financialData.classification) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção.",
        path: ["financialData", "classification"],
      });
    }

    if (!data.financialData.hasOwnStock) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção.",
        path: ["financialData", "hasOwnStock"],
      });
    }
  });

// Schema customizado para o formulário que inclui os campos de tags
export const upsertCustomerFormSchema = z
  .object({
    companyData: z.object({
      cpfCnpj: z.string(),
      ie: z.string(),
      name: z.string(),
      fantasyName: z.string(),
      purposeOfPurchase: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable(),
      phone: z.string(),
      nfeEmail: z.string(),
      financialEmail: z.string(),
      generalEmail: z.string(),
      nfeEmail_tags: z.array(z.string()).default([]),
      financialEmail_tags: z.array(z.string()).default([]),
      generalEmail_tags: z.array(z.string()).default([]),
    }),
    address: z.object({
      postalCode: z.string(),
      street: z.string(),
      neighborhood: z.string(),
      number: z.string(),
      complement: z.string(),
      city: z.string(),
      state: z.string(),
    }),
    financialData: z.object({
      company: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable(),
      unit: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable(),
      representative: z
        .object({
          value: z.number(),
          label: z.string(),
        })
        .nullable(),
      creditAnalysis: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable(),
      isVerified: z.boolean(),
      notes: z.string(),
      classification: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable(),
      hasOwnStock: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable(),
      customerSegment: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
          }),
        )
        .default([]),
      clicheCorrugatedPrice: z.union([z.number(), z.string()]),
      clicheRepairPrice: z.union([z.number(), z.string()]),
      clicheReAssemblyPrice: z.union([z.number(), z.string()]),
      dieCutBlockNationalPrice: z.union([z.number(), z.string()]),
      dieCutBlockImportedPrice: z.union([z.number(), z.string()]),
      easyflowPrice: z.union([z.number(), z.string()]),
      printingPrice: z.union([z.number(), z.string()]),
      profileProofIccPrice: z.union([z.number(), z.string()]),
      finalArtPrice: z.union([z.number(), z.string()]),
      imageProcessingPrice: z.union([z.number(), z.string()]),
      operatorCliche: z
        .object({
          value: z.number(),
          label: z.string(),
        })
        .nullable(),
      operatorDieCutBlock: z
        .object({
          value: z.number(),
          label: z.string(),
        })
        .nullable(),
      operatorImage: z
        .object({
          value: z.number(),
          label: z.string(),
        })
        .nullable(),
      operatorReviewer: z
        .object({
          value: z.number(),
          label: z.string(),
        })
        .nullable(),
      products: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
          }),
        )
        .default([]),
      paymentTerm: z.array(z.number()).default([]),
    }),
    transport: z.object({
      transport: z
        .object({
          value: z.number(),
          label: z.string(),
        })
        .nullable(),
      secondaryTransport: z
        .array(
          z.object({
            value: z.number(),
            label: z.string(),
          }),
        )
        .default([]),
    }),
    complementaryData: z.object({
      procedure: z.string().default(""),
    }),
  })
  .superRefine((data, ctx) => {
    // Validação de CNPJ
    const cnpjCleaned = data.companyData.cpfCnpj.replace(/\D/g, "");
    if (!cnpjCleaned) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CNPJ é obrigatório",
        path: ["companyData", "cpfCnpj"],
      });
    } else if (!validateCNPJ(cnpjCleaned)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe um CNPJ válido.",
        path: ["companyData", "cpfCnpj"],
      });
    }

    // Validação de IE
    if (
      data.companyData.ie.length > 0 &&
      (data.companyData.ie.length < 9 || data.companyData.ie.length > 14)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Inscrição Estadual deve conter de 9 a 14 digitos",
        path: ["companyData", "ie"],
      });
    }

    // Validação de nome da empresa
    if (!data.companyData.name.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nome da empresa é obrigatório",
        path: ["companyData", "name"],
      });
    }

    // Validação de nome fantasia
    if (!data.companyData.fantasyName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nome fantasia é obrigatório",
        path: ["companyData", "fantasyName"],
      });
    }

    // Validação de telefone
    const phoneCleaned = data.companyData.phone.replace(/\D/g, "");
    if (phoneCleaned.length < 10 || phoneCleaned.length > 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Telefone deve conter 10 ou 11 digitos",
        path: ["companyData", "phone"],
      });
    }

    // Validação de emails obrigatórios
    if (!data.companyData.nfeEmail.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "E-mail da NFE é obrigatório",
        path: ["companyData", "nfeEmail"],
      });
    }

    if (!data.companyData.financialEmail.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "E-mail financeiro é obrigatório",
        path: ["companyData", "financialEmail"],
      });
    }

    // Validação de CEP
    if (data.address.postalCode.length !== 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CEP deve ter o formato XXXXX-XXX",
        path: ["address", "postalCode"],
      });
    }

    // Validações de endereço obrigatórios
    if (!data.address.street.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Rua é obrigatória",
        path: ["address", "street"],
      });
    }

    if (!data.address.neighborhood.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bairro é obrigatório",
        path: ["address", "neighborhood"],
      });
    }

    if (!data.address.number.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Número é obrigatório",
        path: ["address", "number"],
      });
    }

    if (!data.address.city.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cidade é obrigatória",
        path: ["address", "city"],
      });
    }

    if (!data.address.state.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Estado é obrigatório",
        path: ["address", "state"],
      });
    }

    // Validação de campos select obrigatórios
    if (!data.companyData.purposeOfPurchase) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção",
        path: ["companyData", "purposeOfPurchase"],
      });
    }

    if (!data.financialData.company) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção",
        path: ["financialData", "company"],
      });
    }

    if (!data.financialData.unit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção",
        path: ["financialData", "unit"],
      });
    }

    if (!data.financialData.creditAnalysis) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção",
        path: ["financialData", "creditAnalysis"],
      });
    }

    if (!data.financialData.classification) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção",
        path: ["financialData", "classification"],
      });
    }

    if (!data.financialData.hasOwnStock) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção",
        path: ["financialData", "hasOwnStock"],
      });
    }

    // Validação de produtos mínimo
    if (data.financialData.products.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Adicione pelo menos 1 produto",
        path: ["financialData", "products"],
      });
    }

    // Validação de prazo de pagamento
    data.financialData.paymentTerm.forEach((term, index) => {
      if (term < 7 || term > 90) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Prazo deve estar entre 7 e 90 dias",
          path: ["financialData", "paymentTerm", index],
        });
      }
    });

    // Validações condicionais baseadas nos produtos selecionados
    const priceConditions = [
      { key: "clicheCorrugatedPrice", enumVal: Product.CLICHE_CORRUGATED },
      { key: "clicheRepairPrice", enumVal: Product.CLICHE_REPAIR },
      { key: "clicheReAssemblyPrice", enumVal: Product.CLICHE_REASSEMBLY },
      {
        key: "dieCutBlockNationalPrice",
        enumVal: Product.DIECUTBLOCK_NATIONAL,
      },
      {
        key: "dieCutBlockImportedPrice",
        enumVal: Product.DIECUTBLOCK_IMPORTED,
      },
      { key: "easyflowPrice", enumVal: Product.EASYFLOW },
      { key: "printingPrice", enumVal: Product.PRINTING },
      { key: "profileProofIccPrice", enumVal: Product.PROFILE_PROOF_ICC },
      { key: "finalArtPrice", enumVal: Product.FINAL_ART },
      { key: "imageProcessingPrice", enumVal: Product.IMAGE_PROCESSING },
    ];

    priceConditions.forEach((condition) => {
      const hasProduct = data.financialData.products.some(
        (product) => product.value === condition.enumVal,
      );

      if (hasProduct) {
        const value =
          data.financialData[condition.key as keyof typeof data.financialData];
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Campo obrigatório.",
            path: ["financialData", condition.key],
          });
        }
      }
    });
  });

// Schema para dados financeiros do cliente externo
const externalFinancialDataSchema = z.object({
  clicheCorrugatedPrice: z.union([z.number(), z.string()]),
  clicheRepairPrice: z.union([z.number(), z.string()]),
  clicheReAssemblyPrice: z.union([z.number(), z.string()]).nullable(),
  dieCutBlockNationalPrice: z.union([z.number(), z.string()]),
  dieCutBlockImportedPrice: z.union([z.number(), z.string()]),
  easyflowPrice: z.union([z.number(), z.string()]),
  printingPrice: z.union([z.number(), z.string()]),
  profileProofIccPrice: z.union([z.number(), z.string()]),
  finalArtPrice: z.union([z.number(), z.string()]),
  imageProcessingPrice: z.union([z.number(), z.string()]),
  products: z.array(selectSchema).min(1, {
    message: "Adicione pelo menos 1 produto.",
  }),
});

// Schema para dados de clientes
const customersDataSchema = z.object({
  customers: z.array(selectNumberSchema),
});

// Schema para dados da empresa do cliente externo
const externalCompanyDataSchema = z.object({
  cpfCnpj: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine(
      (value) => {
        return validateCPF(value) || validateCNPJ(value);
      },
      {
        message: "Informe um CPF/CNPJ válido.",
      },
    ),
  ie: z.union([
    z.string().min(9).max(14, {
      message: "Inscrição Estadual deve conter de 9 a 14 digitos.",
    }),
    z.string().length(0),
  ]),
  name: z.string().min(1, {
    message: "Nome da empresa é obrigatório.",
  }),
  fantasyName: z.string().nullable(),
  purposeOfPurchase: selectSchema.nullable(),
  phone: z
    .string()
    .min(10, "Telefone deve conter 10 ou 11 digitos.")
    .max(11, "Telefone deve conter 10 ou 11 digitos."),
  nfeEmail: z.string().min(1, {
    message: "E-mail da NFE é obrigatório.",
  }),
  financialEmail: z.string().min(1, {
    message: "E-mail financeiro é obrigatório.",
  }),
});

// Schema principal para UpsertExternalCustomer
export const upsertExternalCustomerSchema = z
  .object({
    companyData: externalCompanyDataSchema,
    address: addressSchema,
    financialData: externalFinancialDataSchema,
    customersData: customersDataSchema,
  })
  .superRefine((data, ctx) => {
    // Validações condicionais baseadas nos produtos selecionados
    const priceConditions = [
      { key: "clicheCorrugatedPrice", enumVal: Product.CLICHE_CORRUGATED },
      { key: "clicheRepairPrice", enumVal: Product.CLICHE_REPAIR },
      { key: "clicheReAssemblyPrice", enumVal: Product.CLICHE_REASSEMBLY },
      {
        key: "dieCutBlockNationalPrice",
        enumVal: Product.DIECUTBLOCK_NATIONAL,
      },
      {
        key: "dieCutBlockImportedPrice",
        enumVal: Product.DIECUTBLOCK_IMPORTED,
      },
      { key: "easyflowPrice", enumVal: Product.EASYFLOW },
      { key: "printingPrice", enumVal: Product.PRINTING },
      { key: "profileProofIccPrice", enumVal: Product.PROFILE_PROOF_ICC },
      { key: "finalArtPrice", enumVal: Product.FINAL_ART },
      { key: "imageProcessingPrice", enumVal: Product.IMAGE_PROCESSING },
    ];

    priceConditions.forEach((condition) => {
      const hasProduct = data.financialData.products.some(
        (product) => product.value === condition.enumVal,
      );

      if (hasProduct) {
        const value =
          data.financialData[condition.key as keyof typeof data.financialData];
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Campo obrigatório.",
            path: ["financialData", condition.key],
          });
        }
      }
    });

    // Validação para purposeOfPurchase
    if (!data.companyData.purposeOfPurchase) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma opção.",
        path: ["companyData", "purposeOfPurchase"],
      });
    }
  });

export const priceConditions = [
  { key: "clicheCorrugatedPrice", enumVal: Product.CLICHE_CORRUGATED },
  { key: "clicheRepairPrice", enumVal: Product.CLICHE_REPAIR },
  { key: "clicheReAssemblyPrice", enumVal: Product.CLICHE_REASSEMBLY },
  { key: "dieCutBlockNationalPrice", enumVal: Product.DIECUTBLOCK_NATIONAL },
  { key: "dieCutBlockImportedPrice", enumVal: Product.DIECUTBLOCK_IMPORTED },
  { key: "easyflowPrice", enumVal: Product.EASYFLOW },
  { key: "printingPrice", enumVal: Product.PRINTING },
  { key: "profileProofIccPrice", enumVal: Product.PROFILE_PROOF_ICC },
  { key: "finalArtPrice", enumVal: Product.FINAL_ART },
  { key: "imageProcessingPrice", enumVal: Product.IMAGE_PROCESSING },
];

export function hasProduct(products: { value: string }[], enumVal: string) {
  return products?.some((p) => p.value === enumVal);
}

export function addPriceConditionRefinements<T extends z.ZodTypeAny>(
  schema: T,
): T {
  let refined = schema;
  priceConditions.forEach(({ key, enumVal }) => {
    // @ts-expect-error: superRefine tipagem dinâmica para schema Zod
    refined = refined.superRefine((data: any, ctx: z.RefinementCtx) => {
      const products = data.financialData?.products || [];
      const required = hasProduct(products, enumVal);
      const value = data.financialData?.[key];

      if (required && (value === undefined || value === "" || value === null)) {
        ctx.addIssue({
          path: ["financialData", key],
          code: z.ZodIssueCode.custom,
          message: "Campo obrigatório.",
        });
      }
    });
  });
  return refined;
}

const companyDataSchema = z.object({
  cpfCnpj: z
    .string()
    .min(11, "Informe um CPF/CNPJ válido.")
    .refine(
      (val) => validateCPF(val) || validateCNPJ(val),
      "Informe um CPF/CNPJ válido.",
    ),
  ie: z
    .string()
    .refine(
      (val) => val === "" || (val.length >= 9 && val.length <= 14),
      "Inscrição Estadual deve conter de 9 a 14 dígitos ou estar em branco.",
    ),
  name: z.string().min(1, "Nome da empresa é obrigatório."),
  fantasyName: z.string().optional().nullable(),
  purposeOfPurchase: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((v) => !!v.value && !!v.label, "Selecione uma opção."),
  phone: z
    .string()
    .min(10, "Telefone deve conter 10 ou 11 digitos.")
    .max(11, "Telefone deve conter 10 ou 11 digitos."),
  nfeEmail: z
    .string()
    .min(1, "E-mail da NFE é obrigatório.")
    .regex(emailRegex, "E-mail inválido"),
  financialEmail: z
    .string()
    .min(1, "E-mail financeiro é obrigatório.")
    .regex(emailRegex, "E-mail inválido"),
});

const baseSchema = z.object({
  companyData: companyDataSchema,
  address: addressSchema,
  financialData: externalFinancialDataSchema,
});

export const createExternalCustomerSchema =
  addPriceConditionRefinements(baseSchema);

export type CreateExternalCustomerSchema = z.infer<
  typeof createExternalCustomerSchema
>;
export type UpsertCustomerSchema = z.infer<typeof upsertCustomerSchema>;
export type UpsertCustomerFormSchema = z.infer<typeof upsertCustomerFormSchema>;
export type UpsertExternalCustomerSchema = z.infer<
  typeof upsertExternalCustomerSchema
>;

export { emailRegex };
