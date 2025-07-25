import { PrinterTypeBack } from "./customerprinter";

export interface Cylinder {
  id: number;
  cylinder: number;
  polyesterMaxHeight: number;
  polyesterMaxWidth: number;
  clicheMaxWidth: number;
  clicheMaxHeight: number;
  distortion: number;
  dieCutBlockDistortion: number;
  printer: {
    id: number;
    name: string;
    type: PrinterTypeBack;
  };
}
