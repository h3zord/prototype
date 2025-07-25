import { PrinterType, PrinterTypeBack } from "../types/models/customerprinter";

const printerTypeMap: Record<PrinterTypeBack, PrinterType> &
  Record<PrinterType, PrinterTypeBack> = {
  [PrinterTypeBack.CORRUGATED_PRINTER]: PrinterType.CORRUGATED_PRINTER,
  [PrinterTypeBack.NARROW_WEB_PRINTER]: PrinterType.NARROW_WEB_PRINTER,
  [PrinterTypeBack.WIDE_WEB_PRINTER]: PrinterType.WIDE_WEB_PRINTER,
  [PrinterType.CORRUGATED_PRINTER]: PrinterTypeBack.CORRUGATED_PRINTER,
  [PrinterType.NARROW_WEB_PRINTER]: PrinterTypeBack.NARROW_WEB_PRINTER,
  [PrinterType.WIDE_WEB_PRINTER]: PrinterTypeBack.WIDE_WEB_PRINTER,
};

export const convertToFrontendType = (
  backendType: PrinterTypeBack,
): PrinterType => {
  return printerTypeMap[backendType];
};

export const convertToBackendType = (
  frontendType: PrinterType,
): PrinterTypeBack => {
  return printerTypeMap[frontendType];
};
