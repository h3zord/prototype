import { z } from "zod";
import {
  ServiceOrderProduct,
  ServiceOrderProductType,
} from "../../../types/models/serviceorder";

export const firstStepSchema = z.object({
  customer: z
    .object(
      {
        value: z.number(),
        label: z.string(),
      },
      { required_error: "Selecione uma opção" },
    )
    .nullable()
    .refine((val) => val !== null, {
      message: "Selecione uma opção",
    }),

  externalCustomer: z
    .object(
      {
        value: z.number(),
        label: z.string(),
      },
      { required_error: "Selecione uma opção" },
    )
    .nullable()
    .refine((val) => val !== null, {
      message: "Selecione uma opção",
    }),

  product: z
    .object(
      {
        value: z.nativeEnum(ServiceOrderProduct),
        label: z.string(),
      },
      { required_error: "Selecione uma opção" },
    )
    .nullable()
    .refine((val) => val !== null, {
      message: "Selecione uma opção",
    }),

  budget: z.union([z.number(), z.string()]),

  purchaseOrder: z.string().optional(),

  unit: z
    .object(
      {
        value: z.string(),
        label: z.string(),
      },
      { required_error: "Selecione uma opção" },
    )
    .nullable()
    .refine((val) => val !== null, {
      message: "Selecione uma opção",
    }),

  operator: z
    .object(
      {
        value: z.number(),
        label: z.string(),
      },
      { required_error: "Selecione uma opção" },
    )
    .nullable()
    .refine((val) => val !== null, {
      message: "Selecione uma opção",
    }),
});

export const secondStepSchema = z
  .object({
    dispatchDate: z
      .string({ required_error: "A data de despacho é obrigatória" })
      .nullable()
      .refine((val) => !!val && val.length > 0, {
        message: "Informe uma data válida",
      }),

    title: z.string().min(1, "O título é obrigatório"),

    subTitle: z.string().nullable().optional(),

    barCode: z.string().nullable().optional(),

    itemCodeOnCustomer: z.string().nullable().optional(),

    productType: z
      .object({
        value: z.nativeEnum(ServiceOrderProductType),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Selecione uma opção",
      }),

    isReplacement: z.boolean().nullable().optional(),

    replacementResponsible: z
      .array(
        z.object({
          value: z.number(),
          label: z.string(),
        }),
      )
      .nullable()
      .optional(),

    sector: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .optional(),

    reasonReplacement: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .nullable()
      .optional(),

    renovationRepair: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .nullable()
      .optional(),

    quantityPrinter: z.union([z.number(), z.string()]).nullable().optional(),

    quantityProfileTest: z
      .union([z.number(), z.string()])
      .nullable()
      .optional(),

    file: z
      .union([z.instanceof(File), z.string()])
      .nullable()
      .optional(),

    printSheet: z.union([z.string(), z.any()]).nullable().optional(),

    imageProcessing: z.boolean().nullable().optional(),

    finalArt: z.boolean().nullable().optional(),

    easyflow: z.boolean().nullable().optional(),

    easyflowType: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .optional(),

    itemCliche: z.string().optional(),

    itemDieCutBlockInCliche: z.string().nullable().optional(),

    dieCutBlockSheet: z
      .union([z.instanceof(File), z.string()])
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.easyflow === true) {
        return !!data.easyflowType;
      }
      return true;
    },
    {
      message: "Selecione uma opção",
      path: ["easyflowType"],
    },
  )
  .refine(
    (data) =>
      data.productType?.value !== ServiceOrderProductType.REPAIR
        ? true
        : !!data.renovationRepair && data.renovationRepair.length > 0,
    {
      message: "Adicione pelo menos 1 opção",
      path: ["renovationRepair"],
    },
  )
  .refine(
    (data) =>
      !data.isReplacement
        ? true
        : !!data.replacementResponsible &&
          data.replacementResponsible.length > 0,
    {
      message: "Adicione pelo menos 1 opção",
      path: ["replacementResponsible"],
    },
  )
  .refine((data) => (!data.isReplacement ? true : !!data.sector), {
    message: "Selecione uma opção",
    path: ["sector"],
  })
  .refine(
    (data) =>
      !data.isReplacement
        ? true
        : !!data.reasonReplacement && data.reasonReplacement.length > 0,
    {
      message: "Adicione pelo menos 1 opção",
      path: ["reasonReplacement"],
    },
  )
  .refine(
    (data) =>
      data.productType?.value === ServiceOrderProductType.TEST
        ? true
        : !!data.itemCliche && data.itemCliche.length > 0,
    {
      message: "O item clichê é obrigatório",
      path: ["itemCliche"],
    },
  )
  .refine(
    (data) => {
      if (
        data.itemDieCutBlockInCliche &&
        data.itemDieCutBlockInCliche.length > 0 &&
        data.productType?.value !== ServiceOrderProductType.REPAIR
      ) {
        return !!data.dieCutBlockSheet;
      }
      return true;
    },
    {
      message: "A ficha de forma é obrigatória",
      path: ["dieCutBlockSheet"],
    },
  );

export type SecondStepSchema = z.infer<typeof secondStepSchema>;

export const secondStepDieCutBlockSchema = z
  .object({
    dispatchDate: z
      .string({ required_error: "A data de despacho é obrigatória" })
      .nullable()
      .refine((val) => !!val && val.length > 0, {
        message: "Informe uma data válida",
      }),
    title: z.string().min(1, "O título é obrigatório"),

    subTitle: z.string().nullable().optional(),

    itemCodeOnCustomer: z.string().nullable().optional(),

    productType: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Selecione uma opção",
      }),

    isReplacement: z.boolean().nullable().optional(),

    replacementResponsible: z
      .array(
        z.object({
          value: z.number(),
          label: z.string(),
        }),
      )
      .nullable()
      .optional(),

    sector: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .optional(),

    reasonReplacement: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .nullable()
      .optional(),

    renovationRepair: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .nullable()
      .optional(),

    itemDieCutBlock: z.string().min(1, "O item forma é obrigatório"),

    file: z
      .union([z.instanceof(File), z.string()])
      .nullable()
      .optional(),

    printSheet: z.union([z.string(), z.any()]).nullable().optional(),
  })
  .refine(
    (data) =>
      data.productType?.value !== ServiceOrderProductType.REPAIR ||
      (!!data.renovationRepair && data.renovationRepair.length > 0),
    {
      message: "Adicione pelo menos 1 opção",
      path: ["renovationRepair"],
    },
  )
  .refine(
    (data) =>
      !data.isReplacement
        ? true
        : !!data.replacementResponsible &&
          data.replacementResponsible.length > 0,
    {
      message: "Adicione pelo menos 1 opção",
      path: ["replacementResponsible"],
    },
  )
  .refine((data) => (!data.isReplacement ? true : !!data.sector), {
    message: "Selecione uma opção",
    path: ["sector"],
  })
  .refine(
    (data) =>
      !data.isReplacement
        ? true
        : !!data.reasonReplacement && data.reasonReplacement.length > 0,
    {
      message: "Adicione pelo menos 1 opção",
      path: ["reasonReplacement"],
    },
  );

export const thirdStepSchema = z.object({
  printers: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      }),
    )
    .min(1, "Adicione pelo menos 1 opção"),

  cylinder: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "", { message: "O cilindro é obrigatório" }),

  polyesterMaxHeight: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "", {
      message: "A altura máxima do poliéster é obrigatória",
    }),

  polyesterMaxWidth: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "", {
      message: "A largura máxima do poliéster é obrigatória",
    }),

  clicheMaxWidth: z.union([z.number(), z.string(), z.null()]).optional(),

  clicheMaxHeight: z.union([z.number(), z.string(), z.null()]).optional(),

  distortion: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;

      const num = Number(val);
      return isNaN(num) ? val : num;
    },
    z
      .number({
        required_error: "A distorção é obrigatória",
        invalid_type_error: "A distorção deve ser um número",
      })
      .positive("A distorção deve ser maior que zero"),
  ),

  thicknesses: z.preprocess(
    (val) => (val === "" ? null : val),
    z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, { message: "Selecione uma opção" }),
  ),

  quantitySets: z
    .object({
      value: z.number(),
      label: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, { message: "Selecione uma opção" }),
});

export const thirdStepCorrugatedClicheRepairSchema = z.object({
  quantityColorsToRepair: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.trim() === "") return undefined;

      const number = Number(val);
      return isNaN(number) ? val : number;
    },
    z
      .number({
        invalid_type_error: "A quantidade de cores deve ser um número",
        required_error: "A quantidade de cores é obrigatória",
      })
      .int("A quantidade de cores deve ser um número inteiro")
      .nonnegative("A quantidade não pode ser negativa"),
  ),
});

export const thirdStepDieCutBlockSchema = z.object({
  origin: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .min(1, "Adicione pelo menos 1 opção"),

  printer: z
    .object({
      value: z.number(),
      label: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, { message: "Selecione uma opção" }),

  shapeFile: z.string().min(1, "O arquivo da forma é obrigatório"),

  piecesAmount: z.union([z.number(), z.string()]).refine((val) => val !== "", {
    message: "A quatidade de peças para forma é obrigatória",
  }),

  view: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, { message: "Selecione uma opção" }),

  boxWidth: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;

      const num = Number(val);
      return isNaN(num) ? val : num;
    },
    z
      .number({
        required_error: "A largura da caixa é obrigatária",
        invalid_type_error: "A largura da caixa deve ser um número",
      })
      .positive("A largura da caixa deve ser maior que zero"),
  ),

  boxHeight: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;

      const num = Number(val);
      return isNaN(num) ? val : num;
    },
    z
      .number({
        required_error: "A altura da caixa é obrigatória",
        invalid_type_error: "A altura da caixa deve ser um número",
      })
      .positive("A altura da caixa deve ser maior que zero"),
  ),

  piecesAmountInWidth: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "", {
      message: "A quantidade de peças na largura é obrigatória",
    }),

  piecesAmountInHeight: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "", {
      message: "A quantidade de peças na altura obrigatória",
    }),

  po: z.string().min(1, "PO é obrigatório"),

  notes: z.string(),

  waveDirection: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, { message: "Selecione uma opção" }),
});

export const thirdStepDieCutBlockRepairSchema = z.object({
  origin: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .min(1, "Adicione pelo menos 1 opção"),
});

const selectOption = z.object({
  value: z.string(),
  label: z.string(),
});

const numberSelectOption = z.object({
  value: z.number(),
  label: z.string(),
});

const colorSchema = z.object({
  cliche: z.boolean().nullable().optional(),

  tint: selectOption
    .nullable()
    .refine((val) => val !== null, { message: "Selecione uma opção" }),

  lineature: selectOption
    .nullable()
    .refine((val) => val !== null, { message: "Selecione uma opção" }),

  curve: z
    .object({
      value: z.number(),
      label: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, { message: "Selecione uma opção" }),

  angle: z
    .object({
      value: z.number().min(0),
      label: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Selecione uma opção",
    }),

  dotType: selectOption
    .nullable()
    .refine((val) => val !== null, { message: "Selecione uma opção" }),
});

export const fourthStepSchema = z
  .object({
    profile: numberSelectOption.nullable().optional(),

    colorsPattern: selectOption.nullable().optional(),

    trap: z.preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return undefined;

        const num = Number(val);
        return isNaN(num) ? val : num;
      },
      z
        .number({
          required_error: "O trap é obrigatório",
          invalid_type_error: "Trap deve ser um número",
        })
        .positive("Trap deve ser maior que zero"),
    ),

    notes: z.string().nullable().optional(),

    colors: z.array(colorSchema).nullable().optional(),

    productType: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.productType?.value !== "TEST") {
        return !!data.profile;
      }
      return true;
    },
    {
      message: "Selecione uma opção",
      path: ["profile"],
    },
  )
  .refine(
    (data) => {
      if (data.productType?.value !== "TEST") {
        return !!data.colorsPattern;
      }
      return true;
    },
    {
      message: "Selecione uma opção",
      path: ["colorsPattern"],
    },
  )
  .refine(
    (data) => {
      if (data.productType?.value !== "TEST") {
        return !!data.colors && data.colors.length > 0;
      }
      return true;
    },
    {
      message: "É necessário pelo menos uma cor",
      path: ["colors"],
    },
  );

export enum StepKeys {
  Step1 = "step1",
  Step2ClicheCorrugated = "step2",
  Step2DieCutBlock = "step2diecutblock",
  Step3ClicheCorrugated = "step3clichecorrugated",
  Step3ClicheCorrugatedRepair = "step3clichecorrugatedrepair",
  Step3DieCutBlock = "step3diecutblock",
  Step4 = "step4",
  Step3DieCutBlockRepair = "step3diecutblockrepair",
}

export const stepSchemas = {
  [StepKeys.Step1]: firstStepSchema,
  [StepKeys.Step2ClicheCorrugated]: secondStepSchema,
  [StepKeys.Step2DieCutBlock]: secondStepDieCutBlockSchema,
  [StepKeys.Step3ClicheCorrugated]: thirdStepSchema,
  [StepKeys.Step3DieCutBlock]: thirdStepDieCutBlockSchema,
  [StepKeys.Step3ClicheCorrugatedRepair]: thirdStepCorrugatedClicheRepairSchema,
  [StepKeys.Step3DieCutBlockRepair]: thirdStepDieCutBlockRepairSchema,
  [StepKeys.Step4]: fourthStepSchema,
} as const;

export const modifyTransportOnlySchema = z.object({
  transport: z
    .object({
      value: z.number(),
      label: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Selecione um transporte válido",
    }),
});

export type ModifyTransportOnlyFormData = z.infer<
  typeof modifyTransportOnlySchema
>;

const selectOptionNumberSchema = z
  .object({
    value: z.number(),
    label: z.string(),
  })
  .nullable()
  .refine((val) => val !== null, {
    message: "Selecione uma opção",
  });

const selectOptionStringSchema = z
  .object({
    value: z.string(),
    label: z.string(),
  })
  .nullable()
  .refine((val) => val !== null, {
    message: "Selecione uma opção",
  });

export const modifyServiceOrderSchema = z.object({
  operator: selectOptionNumberSchema,
  transport: selectOptionNumberSchema,
  dispatchDate: z
    .string()
    .min(1, { message: "Data de despacho é obrigatório" }),
  unit: selectOptionStringSchema,
  status: selectOptionStringSchema.optional(),
});

export type ModifyServiceOrderFormData = z.infer<
  typeof modifyServiceOrderSchema
>;

const optionalSelectOptionNumberSchema = z
  .object({
    value: z.number(),
    label: z.string(),
  })
  .optional()
  .nullable();

const optionalSelectOptionStringSchema = z
  .object({
    value: z.string(),
    label: z.string(),
  })
  .optional()
  .nullable();

export const optionalModifyServiceOrderSchema = z.object({
  operator: optionalSelectOptionNumberSchema,
  transport: optionalSelectOptionNumberSchema,
  dispatchDate: z.string().min(1).optional().nullable(),
  unit: optionalSelectOptionStringSchema,
  status: optionalSelectOptionStringSchema,
});

export type OptionalModifyServiceOrderFormData = z.infer<
  typeof optionalModifyServiceOrderSchema
>;

export const createPurchaseOrderSchema = z.object({
  purchaseOrder: z.string().min(1, "A Ordem de Compra é obrigatória"),
});

export type CreatePurchaseOrderSchemaZod = z.infer<
  typeof createPurchaseOrderSchema
>;

export interface InsertMeasuresDieCutBlockSchema {
  productType: "NEW" | "ALTERATION" | "REPLACEMENT" | "REPAIR" | "RECONFECTION";
  origin: ("NATIONAL" | "IMPORTED")[];
  channelQuantity?: number;
  dieCutBlockNationalCutStraight?: number;
  dieCutBlockNationalCutCurve?: number;
  dieCutBlockNationalCreaseStraight?: number;
  dieCutBlockNationalCreaseCurve?: number;
  dieCutBlockNationalPerforationStraight?: number;
  dieCutBlockNationalPerforationCurve?: number;
  dieCutBlockImportedCutStraight?: number;
  dieCutBlockImportedCutCurve?: number;
  dieCutBlockImportedCreaseStraight?: number;
  dieCutBlockImportedCreaseCurve?: number;
  dieCutBlockImportedPerforationStraight?: number;
  dieCutBlockImportedPerforationCurve?: number;
  recordingDate?: string;
  hasChannel?: boolean;
}

export const insertMeasuresDieCutBlockSchema = z
  .object({
    productType: z.enum(
      ["NEW", "ALTERATION", "REPLACEMENT", "REPAIR", "RECONFECTION"],
      {
        errorMap: () => ({ message: "Selecione um tipo de produto válido" }),
      },
    ),

    origin: z
      .array(z.enum(["NATIONAL", "IMPORTED"]))
      .min(1, "Selecione ao menos uma origem")
      .refine((arr) => new Set(arr).size === arr.length, {
        message: "Valores duplicados não são permitidos",
      }),

    recordingDate: z
      .string({
        errorMap: () => ({ message: "A data de gravação é obrigatória" }),
      })
      .optional(),

    hasChannel: z.boolean().optional(),

    channelQuantity: z.number().optional(),

    // Campos nacionais
    dieCutBlockNationalCutStraight: z.number().optional(),
    dieCutBlockNationalCutCurve: z.number().optional(),
    dieCutBlockNationalCreaseStraight: z.number().optional(),
    dieCutBlockNationalCreaseCurve: z.number().optional(),
    dieCutBlockNationalPerforationStraight: z.number().optional(),
    dieCutBlockNationalPerforationCurve: z.number().optional(),

    // Campos importados
    dieCutBlockImportedCutStraight: z.number().optional(),
    dieCutBlockImportedCutCurve: z.number().optional(),
    dieCutBlockImportedCreaseStraight: z.number().optional(),
    dieCutBlockImportedCreaseCurve: z.number().optional(),
    dieCutBlockImportedPerforationStraight: z.number().optional(),
    dieCutBlockImportedPerforationCurve: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    // Validação para channelQuantity quando productType requer e hasChannel é true
    const productTypesRequiringChannel = ["NEW", "ALTERATION", "REPLACEMENT"];

    if (
      productTypesRequiringChannel.includes(data.productType) &&
      data.hasChannel === true
    ) {
      if (
        data.channelQuantity === undefined ||
        data.channelQuantity === null ||
        data.channelQuantity === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A quantidade do canal é obrigatória",
          path: ["channelQuantity"],
        });
      }
    }

    // Validação para garantir que pelo menos um campo de medida seja preenchido
    const nationalFields = [
      {
        value: data.dieCutBlockNationalCutStraight,
        field: "dieCutBlockNationalCutStraight",
      },
      {
        value: data.dieCutBlockNationalCutCurve,
        field: "dieCutBlockNationalCutCurve",
      },
      {
        value: data.dieCutBlockNationalCreaseStraight,
        field: "dieCutBlockNationalCreaseStraight",
      },
      {
        value: data.dieCutBlockNationalCreaseCurve,
        field: "dieCutBlockNationalCreaseCurve",
      },
      {
        value: data.dieCutBlockNationalPerforationStraight,
        field: "dieCutBlockNationalPerforationStraight",
      },
      {
        value: data.dieCutBlockNationalPerforationCurve,
        field: "dieCutBlockNationalPerforationCurve",
      },
    ];

    const importedFields = [
      {
        value: data.dieCutBlockImportedCutStraight,
        field: "dieCutBlockImportedCutStraight",
      },
      {
        value: data.dieCutBlockImportedCutCurve,
        field: "dieCutBlockImportedCutCurve",
      },
      {
        value: data.dieCutBlockImportedCreaseStraight,
        field: "dieCutBlockImportedCreaseStraight",
      },
      {
        value: data.dieCutBlockImportedCreaseCurve,
        field: "dieCutBlockImportedCreaseCurve",
      },
      {
        value: data.dieCutBlockImportedPerforationStraight,
        field: "dieCutBlockImportedPerforationStraight",
      },
      {
        value: data.dieCutBlockImportedPerforationCurve,
        field: "dieCutBlockImportedPerforationCurve",
      },
    ];

    // Verifica se pelo menos um campo nacional tem valor quando origem inclui NATIONAL
    if (data.origin.includes("NATIONAL")) {
      const hasNationalValue = nationalFields.some(
        (field) =>
          field.value !== undefined && field.value !== null && field.value > 0,
      );

      if (!hasNationalValue) {
        // Adiciona erro em todos os campos nacionais para mostrar que pelo menos um é obrigatório
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Preencha pelo menos uma medida nacional",
          path: ["dieCutBlockNationalCutStraight"],
        });
      }
    }

    // Verifica se pelo menos um campo importado tem valor quando origem inclui IMPORTED
    if (data.origin.includes("IMPORTED")) {
      const hasImportedValue = importedFields.some(
        (field) =>
          field.value !== undefined && field.value !== null && field.value > 0,
      );

      if (!hasImportedValue) {
        // Adiciona erro em todos os campos importados para mostrar que pelo menos um é obrigatório
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Preencha pelo menos uma medida importada",
          path: ["dieCutBlockImportedCutStraight"],
        });
      }
    }
  });

export interface InsertMeasuresCorrugatedClicheSchema {
  productType: ServiceOrderProductType;
  renovationRepair?: string[];
  colors?: {
    tint: { value: string; label: string } | null;
    quantity?: number;
    width?: number;
    height?: number;
  }[];
  recordingDate?: string;
}

// Schema base para tint
const tintSchema = z.object(
  {
    value: z.string(),
    label: z.string(),
  },
  {
    errorMap: () => ({ message: "Selecione uma opção" }),
  },
);

// Schema base para color item
const colorItemBaseSchema = z.object({
  tint: tintSchema.nullable().optional(),
  quantity: z.coerce.number(),
  width: z.coerce.number(),
  height: z.coerce.number(),
});

// Schema principal (para API)
export const insertMeasuresCorrugatedClicheSchema = z
  .object({
    productType: z.nativeEnum(ServiceOrderProductType, {
      errorMap: () => ({ message: "Selecione um tipo de produto válido" }),
    }),

    renovationRepair: z.array(z.string()).optional(),

    colors: z
      .array(colorItemBaseSchema, {
        errorMap: () => ({ message: "É necessário pelo menos uma cor" }),
      })
      .optional(),

    recordingDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Tipos de produto que requerem validação completa das cores
    const productTypesRequiringColors = [
      ServiceOrderProductType.NEW,
      ServiceOrderProductType.ALTERATION,
      ServiceOrderProductType.REASSEMBLY,
    ];

    if (productTypesRequiringColors.includes(data.productType)) {
      // Colors é obrigatório
      if (!data.colors || data.colors.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "É necessário pelo menos uma cor",
          path: ["colors"],
        });
        return;
      }

      // Validar cada item de cor
      data.colors.forEach((color, index) => {
        // Tint é obrigatório
        if (!color.tint) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecione uma opção",
            path: ["colors", index, "tint"],
          });
        }

        // Quantity é obrigatório e deve ser válido
        if (
          color.quantity === undefined ||
          color.quantity === null ||
          color.quantity === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Campo obrigatório",
            path: ["colors", index, "quantity"],
          });
        }

        // Width é obrigatório e deve ser válido
        if (
          color.width === undefined ||
          color.width === null ||
          color.width === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Campo obrigatório",
            path: ["colors", index, "width"],
          });
        }

        // Height é obrigatório e deve ser válido
        if (
          color.height === undefined ||
          color.height === null ||
          color.height === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Campo obrigatório",
            path: ["colors", index, "height"],
          });
        }
      });
    }
  });

// Schema específico para React Hook Form
export const insertMeasuresCorrugatedClicheFormSchema = z
  .object({
    productType: z.nativeEnum(ServiceOrderProductType, {
      errorMap: () => ({ message: "Selecione um tipo de produto válido" }),
    }),

    renovationRepair: z.array(z.string()).optional(),

    colors: z
      .array(
        z.object({
          tint: tintSchema.nullable().optional(),
          quantity: z.union([z.string(), z.number()]),
          width: z.union([z.string(), z.number()]),
          height: z.union([z.string(), z.number()]),
        }),
        {
          errorMap: () => ({ message: "É necessário pelo menos uma cor" }),
        },
      )
      .optional(),

    recordingDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Tipos de produto que requerem validação completa das cores
    const productTypesRequiringColors = [
      ServiceOrderProductType.NEW,
      ServiceOrderProductType.ALTERATION,
      ServiceOrderProductType.REASSEMBLY,
    ];

    if (productTypesRequiringColors.includes(data.productType)) {
      // Colors é obrigatório
      if (!data.colors || data.colors.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "É necessário pelo menos uma cor",
          path: ["colors"],
        });
        return;
      }

      // Validar cada item de cor
      data.colors.forEach((color, index) => {
        // Tint é obrigatório
        // A validação de tint foi removida pois o campo não é mais obrigatório

        // Quantity é obrigatório e deve ser válido
        const quantity =
          typeof color.quantity === "string"
            ? parseFloat(color.quantity)
            : color.quantity;
        if (
          !color.quantity ||
          color.quantity === "" ||
          quantity === 0 ||
          (quantity !== undefined && isNaN(quantity))
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Campo obrigatório",
            path: ["colors", index, "quantity"],
          });
        }

        // Width é obrigatório e deve ser válido
        const width =
          typeof color.width === "string"
            ? parseFloat(color.width)
            : color.width;
        if (
          !color.width ||
          color.width === "" ||
          width === 0 ||
          (width !== undefined && isNaN(width))
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Campo obrigatório",
            path: ["colors", index, "width"],
          });
        }

        // Height é obrigatório e deve ser válido
        const height =
          typeof color.height === "string"
            ? parseFloat(color.height)
            : color.height;
        if (
          !color.height ||
          color.height === "" ||
          height === 0 ||
          (height !== undefined && isNaN(height))
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Campo obrigatório",
            path: ["colors", index, "height"],
          });
        }
      });
    }
  });

// Tipos inferidos dos schemas Zod
export type InsertMeasuresCorrugatedClicheInput = z.infer<
  typeof insertMeasuresCorrugatedClicheSchema
>;
export type InsertMeasuresCorrugatedClicheFormInput = z.infer<
  typeof insertMeasuresCorrugatedClicheFormSchema
>;

// Função para transformar dados do form para o schema de API
export const transformFormToSchema = (
  formData: InsertMeasuresCorrugatedClicheFormInput,
): InsertMeasuresCorrugatedClicheSchema => {
  return {
    productType: formData.productType,
    renovationRepair: formData.renovationRepair,
    recordingDate: formData.recordingDate,
    colors: formData.colors?.map((color) => ({
      tint: color.tint || null,
      quantity:
        typeof color.quantity === "string"
          ? parseFloat(color.quantity)
          : color.quantity || 0,
      width:
        typeof color.width === "string"
          ? parseFloat(color.width)
          : color.width || 0,
      height:
        typeof color.height === "string"
          ? parseFloat(color.height)
          : color.height || 0,
    })),
  };
};
