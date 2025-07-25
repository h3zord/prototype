import {
  PurposeOfPurchase,
  Unit,
  CreditAnalysis,
  Classification,
  Company,
  Product,
  CustomerSegment,
} from "../../types/models/customer";

export const purposeOfPurchaseOptions = [
  {
    value: PurposeOfPurchase.USAGE_CONSUMPTION_FIXED,
    label: "Uso Consumo/Imobilizado",
  },
  {
    value: PurposeOfPurchase.INDUSTRIALIZATION,
    label: "Industrialização",
  },
  {
    value: PurposeOfPurchase.COMERCIALIZATION,
    label: "Comercialização",
  },
];

export const unitOptions = [
  { value: Unit.RS_PORTO_ALEGRE, label: "(POA) Porto Alegre" },
  { value: Unit.SP_INDAIATUBA, label: "(IND) Indaiatuba" },
  { value: Unit.RS_FARROUPILHA, label: "(FRR) Farroupilha" },
];

export const unitAbbrevOptions = [
  { value: Unit.RS_PORTO_ALEGRE, label: "POA" },
  { value: Unit.SP_INDAIATUBA, label: "IND" },
  { value: Unit.RS_FARROUPILHA, label: "FRR" },
];

export const creditAnalysisOptions = [
  { value: CreditAnalysis.RELEASED, label: "Liberado" },
  { value: CreditAnalysis.RESTRICTED, label: "Restrito" },
];

export const classificationOptions = [
  { value: Classification.A, label: "A" },
  { value: Classification.B, label: "B" },
  { value: Classification.C, label: "C" },
];

export const hasOwnStockOptions = [
  { value: "true", label: "Sim" },
  { value: "false", label: "Não" },
];

export const companyOptions = [
  { value: Company.POLIBRAS, label: "Polibras" },
  { value: Company.DIGIFLEXO, label: "Digiflexo" },
];

export const statusOptions = [
  { value: "released", label: "Liberado" },
  { value: "released_with_deadline", label: "Liberado com prazo" },
  { value: "blocked", label: "Bloqueado" },
];

export const customerSegment = [
  { value: CustomerSegment.CORRUGATED, label: "Corrugado" },
  { value: CustomerSegment.NARROW_WEB, label: "Banda Larga" },
  { value: CustomerSegment.WIDE_WEB, label: "Banda Estreita" },
];

export const productOptions = [
  // { value: Product.CLICHE_REFORM, label: "Reforma" },

  { value: Product.CLICHE_CORRUGATED, label: "Clichê Corrugado" },
  { value: Product.CLICHE_REPAIR, label: "Conserto" },
  { value: Product.CLICHE_REASSEMBLY, label: "Remontagem" },
  { value: Product.DIECUTBLOCK_NATIONAL, label: "Forma Nacional" },
  { value: Product.DIECUTBLOCK_IMPORTED, label: "Forma Importada" },
  { value: Product.EASYFLOW, label: "Easyflow" },
  { value: Product.FINAL_ART, label: "Arte Final" },
  { value: Product.IMAGE_PROCESSING, label: "Tratamento de Imagem" },
  { value: Product.PRINTING, label: "Printer" },
  { value: Product.PROFILE_PROOF_ICC, label: "Perfil Prova ICC" },
];

export const transportOptions = [{ value: "direct", label: "Direto" }];
