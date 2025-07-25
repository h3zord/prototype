export type Profile = {
  id: number;
  name: string;
  printer: {
    id: number;
    name: string;
    type: PrinterType;
  };
  colors: any[];
};

enum PrinterType {
  CORRUGATED_PRINTER = "CORRUGATED_PRINTER",
  NARROW_WEB_PRINTER = "NARROW_WEB_PRINTER",
  WIDE_WEB_PRINTER = "WIDE_WEB_PRINTER",
}
