export interface Customer {
  id: number;
  cpfCnpj: string;
  ie: string;
  name: string;
  fantasyName: string;
  purposeOfPurchase: PurposeOfPurchase;
  phone: string;
  nfeEmail: string;
  financialEmail: string;
  generalEmail: string;
  postalCode: string;
  street: string;
  neighborhood: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  company: Company;
  unit: Unit;
  creditAnalysis: CreditAnalysis;
  isVerified: boolean;
  notes: string;
  classification: Classification;
  hasOwnStock: string;
  clicheCorrugatedPrice: number;
  clicheRepairPrice: number;

  // clicheReformPrice: number;
  // clicheReformMinimum: number;

  clicheReAssemblyPrice: number;
  dieCutBlockNationalPrice: number;
  dieCutBlockImportedPrice: number;
  easyflowPrice: number;
  printingPrice: number;
  profileProofIccPrice: number;
  finalArtPrice: number;
  imageProcessingPrice: number;
  transport: { fantasyName: string; id: number };
  secondaryTransport: { fantasyName: string; id: number }[];
  procedure: string;
  type: CustomerType;
  representative: { firstName: string; lastName: string; id: number };
  operatorCliche: { firstName: string; lastName: string; id: number };
  operatorDieCutBlock: { firstName: string; lastName: string; id: number };
  operatorImage: { firstName: string; lastName: string; id: number };
  operatorReviewer: { firstName: string; lastName: string; id: number };
  standardCustomers: Customer[];
  externalCustomers: Customer[];
  customerSegment: CustomerSegment[];
  products: Product[];
  paymentTerm: number[];
}

export enum CustomerType {
  STANDARD = "STANDARD",
  EXTERNAL = "EXTERNAL",
  FLEXOGRAV = "FLEXOGRAV",
}

export enum Product {
  CLICHE_REFORM = "CLICHE_REFORM",
  CLICHE_CORRUGATED = "CLICHE_CORRUGATED",
  CLICHE_REPAIR = "CLICHE_REPAIR",
  CLICHE_REASSEMBLY = "CLICHE_REASSEMBLY",
  DIECUTBLOCK_NATIONAL = "DIECUTBLOCK_NATIONAL",
  DIECUTBLOCK_IMPORTED = "DIECUTBLOCK_IMPORTED",
  EASYFLOW = "EASYFLOW",
  PRINTING = "PRINTING",
  PROFILE_PROOF_ICC = "PROFILE_PROOF_ICC",
  FINAL_ART = "FINAL_ART",
  IMAGE_PROCESSING = "IMAGE_PROCESSING",
}

export enum CustomerSegment {
  CORRUGATED = "CORRUGATED",
  NARROW_WEB = "NARROW_WEB",
  WIDE_WEB = "WIDE_WEB",
}

export enum PurposeOfPurchase {
  USAGE_CONSUMPTION_FIXED = "USAGE_CONSUMPTION_FIXED",
  INDUSTRIALIZATION = "INDUSTRIALIZATION",
  COMERCIALIZATION = "COMERCIALIZATION",
}

export enum Unit {
  RS_PORTO_ALEGRE = "RS_PORTO_ALEGRE",
  SP_INDAIATUBA = "SP_INDAIATUBA",
  RS_FARROUPILHA = "RS_FARROUPILHA",
}

export enum CreditAnalysis {
  RELEASED = "RELEASED",
  RESTRICTED = "RESTRICTED",
}

export enum Classification {
  A = "A",
  B = "B",
  C = "C",
}

export enum Company {
  POLIBRAS = "POLIBRAS",
  DIGIFLEXO = "DIGIFLEXO",
}
