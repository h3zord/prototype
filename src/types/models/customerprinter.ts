// export type Printer = {
//   id: number;
//   type:
//     | PrinterType.CORRUGADO
//     | PrinterType.BANDA_LARGA
//     | PrinterType.BANDA_ESTREITA;
//   name: string;
//   variation: string;
//   lap: string;
//   colors: string;
//   standardLineature: string;
//   colorLineatures: string[];
// };

export enum PrinterType {
  CORRUGATED_PRINTER = "Corrugado",
  NARROW_WEB_PRINTER = "Banda Larga",
  WIDE_WEB_PRINTER = "Banda Estreita",
}

export type Printer = {
  id: number;
  name: string;
  type: PrinterTypeBack;
  colorsAmount: number;
  trap: number;
  lineatures: string[];
  dotTypes: string[];
  curves: Curve[];
  angles: number[];
  thicknesses: string[];

  corrugatedPrinter: CorrugatedPrinter | null;
  customer: { id: number; name: string };
  customerId: number;
  cylinders: Cylinder[];
  profiles: Profile[];
};

export type Cylinder = {
  id: number;
  cylinder: number;
  polyesterMaxHeight: number;
  polyesterMaxWidth: number;
  clicheMaxWidth: number | null;
  clicheMaxHeight: number | null;
  distortion: number;
  dieCutBlockDistortion: number | null;
  printerId: number;
  deletedAt: string | null;
};

export type Profile = {
  id: number;
  name: string;
  printerId: number;
  deletedAt: string | null;
};

export type Curve = {
  id: number;
  name: string;
  customerId: number | null;
  createdAt: string;
  userInc: number;
  updatedAt: string;
  userAlt: number;
  deletedAt: string | null;
  userDel: number | null;
};

export type CorrugatedPrinter = {
  id: number;
  printerId: number;
  variation: number;
  channels: { id: number; name: string }[];
  channelMinimum: number;
  flap: Flap;
};

export enum PrinterTypeBack {
  CORRUGATED_PRINTER = "CORRUGATED_PRINTER",
  NARROW_WEB_PRINTER = "NARROW_WEB_PRINTER",
  WIDE_WEB_PRINTER = "WIDE_WEB_PRINTER",
}

export enum Flap {
  NONE = "NONE",
  RIGHT = "RIGHT",
  LEFT = "LEFT",
  LEFT_AND_RIGHT = "LEFT_AND_RIGHT",
}

export type PrinterOS = {
  id: number;
  name: string;
  defaultLineature: string;
  colorsAmount: number;
  hds: string[];
  thicknesses: string[];
  curves: any[];
  angles: any[];
  lineatures: any[];
  dotTypes: any[];
  cylinders: Cylinder[];
  trap: number;
  profiles: Profile[];
};

export type colorsOS = {
  id?: number;
  engrave: boolean;
  lineature: string;
  color: string;
  hd: string;
  curve: string;
};
