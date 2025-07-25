export interface ColorDetail {
  id?: number;
  ink?: string;
  lineature?: string;
  angle?: number;
  dotType?: string;
  curve?: string;
  recordCliche?: boolean;
}

export interface Profile {
  id?: number;
  name?: string;
  colors?: ColorDetail[];
}

export interface CorrugatedPrinterDetails {
  variation?: number;
  flap?: string;
  channels?: { name?: string }[];
  channelMinimum?: number;
}

export interface PrinterData {
  id?: number;
  name?: string;
  type?: string;
  trap?: number;
  thicknesses?: string[];
  profiles?: Profile[];
  corrugatedPrinter?: CorrugatedPrinterDetails;
}

export interface DieCutBlockDetails {
  id?: number;
  shapeFile?: string | null;
  itemDieCutBlock?: string | null;
  po?: string | null;
  view?: string | null;
  channel?: string | null;
  waveDirection?: string | null;
  piecesAmount?: number | null;
  piecesAmountInWidth?: number | null;
  piecesAmountInHeight?: number | null;
  boxWidth?: number | null;
  boxHeight?: number | null;
  origin?: string[];
  measures?: any;
}

export interface ServiceOrder {
  printerDetails: any;
  barCode: string;
  printSheet: string;
  id: number;
  version?: number;
  unit?: string;
  product: string;
  productType: string;
  dispatchDate?: string | Date;
  entryDate?: string | Date;
  budget?: number | null;
  totalPrice?: number | null;
  title?: string | null;
  subTitle?: string | null;
  itemCodeOnCustomer?: string | null;
  identificationNumber?: string | null;
  file?: string | null;
  dieCutBlockSheet?: string | null;
  notes?: string | null;
  pdfFilePath?: string | null;
  pdfSent?: boolean;
  pdfApprovalStatus?: string | null;
  renovationRepair?: string[];
  status?: string;
  customer?: {
    id?: number;
    fantasyName?: string;
    name?: string;
    products?: string[];
    finalArtPrice?: number | null;
    imageProcessingPrice?: number | null;
    easyflowPrice?: number | null;
    profileProofIccPrice?: number | null;
    printingPrice?: number | null;
    procedure: string;
    representative?: {
      firstName?: string;
      lastName?: string;
    };
  } | null;
  transport?: { id?: number; name?: string } | null;
  operator?: { id?: number; firstName?: string; lastName?: string } | null;
  representative?: {
    id?: number;
    firstName?: string;
    lastName?: string;
  } | null;
  previousServiceOrderId?: number | null;
  externalCustomer?: {
    id?: number;
    name?: string;
    fantasyName?: string;
  } | null;
  printer?: PrinterData | null;
  printerId?: number | null;
  dieCutBlockDetails?: DieCutBlockDetails | null;
  dieCutBlockNationalPrice?: number | null;
  invoiceDetails?: { nfNumber?: string | null; purchaseOrder?: string | null };
  dieCutBlockImportedPrice?: number | null;
  replacementProductType: string;
  sector: string;
  reasonReplacement: string[];
  replacementResponsibles: any[];
  reuseSourceOrderId: number;
  purchaseOrder: string;
}

export interface ClicheCorrugatedPDFProps {
  onClose: () => void;
  selectedServiceOrder: ServiceOrder;
}

export interface DieCutBlockPDFProps {
  onClose: () => void;
  selectedServiceOrder: ServiceOrder;
}

export const productTypeLabels: Record<string, string> = {
  NEW: "Novo",
  ALTERATION: "Alteração",
  REPLACEMENT: "Reposição",
  // REFORM: "Reforma",
  REPAIR: "Conserto",
  REASSEMBLY: "Remontagem",
  REPRINT: "Regravação",
  RECONFECTION: "Reconfecção",
  TEST: "Teste",
};

export const productLabels: Record<string, string> = {
  DIECUTBLOCK: "Forma",
  CLICHE_CORRUGATED: "Clichê Corrugado",
};
