export enum ServiceOrderProduct {
  DIECUTBLOCK = "DIECUTBLOCK",
  CLICHE_CORRUGATED = "CLICHE_CORRUGATED",
}

export enum ServiceOrderProductType {
  // REFORM = "REFORM",
  NEW = "NEW",
  ALTERATION = "ALTERATION",
  REPAIR = "REPAIR",
  REPLACEMENT = "REPLACEMENT",
  REASSEMBLY = "REASSEMBLY",
  RECONFECTION = "RECONFECTION",
  REPRINT = "REPRINT",
  TEST = "TEST",
}

export enum WaveDirection {
  IN_FAVOR_OF_THE_WAVE = "IN_FAVOR_OF_THE_WAVE",
  AGAINST_THE_WAVE = "AGAINST_THE_WAVE",
}

export enum DieCutBlockView {
  INTERN = "INTERN",
  EXTERN = "EXTERN",
}

export enum DieCutBlockOrigin {
  NATIONAL = "NATIONAL",
  IMPORTED = "IMPORTED",
}

export enum ServiceOrderStatus {
  WAITING_PRODUCTION = "WAITING_PRODUCTION",
  PREPRESS = "PREPRESS",
  CREDIT_ANALYSIS = "CREDIT_ANALYSIS",
  CONFERENCE = "CONFERENCE",
  PREASSEMBLY = "PREASSEMBLY",
  IN_APPROVAL = "IN_APPROVAL",
  RECORDING = "RECORDING",
  LAYOUT = "LAYOUT",
  IMAGE_PROCESSING = "IMAGE_PROCESSING",
  CNC = "CNC",
  DEVELOPMENT = "DEVELOPMENT",
  LAMINATION = "LAMINATION",
  RUBBERIZING = "RUBBERIZING",
  CANCELLED = "CANCELLED",
  FINALIZED = "FINALIZED",
  DISPATCHED = "DISPATCHED",
  PLOTTING = "PLOTTING",
}

export interface InvoicedServiceOrder {
  dispatchedDate: Date;
  identificationNumber: string;
  budget: number;
  itemCodeOnCustomer: string;
  totalPrice: number;
  product: any;
  productType: any;
  replacementProductType?: ServiceOrderProductType;
  unit: any;
  version: number;
  purchaseOrder: string;
  title: string;
  subTitle: string;
  customer: {
    fantasyName: string;
  };
  invoiceDetails: {
    nfNumber: string;
    shippingPrice: number;
    serialNumber?: string;
    otherPrice: number;
    discount: number;
    billingDate: Date;
  };
  operator: {
    firstName: string;
    lastName: string;
  };
  transport: {
    fantasyName: string;
  };
  // Propriedades adicionadas para reposições
  replacementResponsibles?:
    | {
        firstName: string;
        lastName: string;
      }[]
    | null;
  replacementResponsibleId?: number | null;
  reasonReplacement?: string[];
  printerDetails: {
    itemCliche?: string;
    itemDieCutBlockInCliche?: string;
    corrugatedPrinterDetails: {
      measures: {
        totalMeasuresCliche: number;
      };
    };
  };
  dieCutBlockDetails: {
    itemDieCutBlock: string;
    measures: {
      totalLinearMetersChannel: number;
      totalMeasuresImported: number;
      totalMeasuresNational: number;
    };
  };
}
