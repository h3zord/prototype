import React from "react";
import { colorsHexa } from "../../../../helpers/tabelaCoresHex";
import { formatPrice } from "../../../../helpers/formatter";
import { InfoField } from "./ClicheCorrugatedPDF";

interface ColorRow {
  recordCliche: boolean;
  ink?: string | null;
  lineature?: number | string | null;
  angle?: number | string | null;
  dotType?: string | null;
  curve?: any | null;
}

interface MeasureRow {
  quantity: string | number;
  width: string | number;
  height: string | number;
  totalMeasure: string | number;
}

interface ColorsTableProps {
  colors: ColorRow[];
  repairColorsQuantity?: number;
  totalRows: number;
  trap: number;
  colorsPattern: string;
  profileName: string;
  procedure?: string;
  showProcedure?: boolean;
}

const ColorsTable: React.FC<ColorsTableProps> = ({
  colors,
  repairColorsQuantity = 0,
  totalRows,
  trap,
  profileName,
  colorsPattern,
  procedure,
  showProcedure,
}) => {
  const colorCount = colors.length;

  function getColorNameByHex(hex?: string): string {
    if (!hex) return "-";
    const color = colorsHexa.find(
      (c) => c.hex.toLowerCase() === hex.toLowerCase(),
    );
    return color?.color || hex;
  }

  return (
    <div className="w-[60%] align-top overflow-hidden flex flex-col">
      <h2 className="text-lg mb-1 text-center lg:text-left mt-1">Cores</h2>

      <table
        className="w-full table-fixed border-collapse"
        style={{
          borderTopLeftRadius: "12px",
          borderBottomLeftRadius: "12px",
          overflow: "hidden",
        }}
      >
        <colgroup>
          <col className="w-[23px]" />
          <col className="w-[55px]" />
          <col className="w-[35px]" />
          <col className="w-[30px]" />
          <col className="w-1/6" />
          <col className="w-1/5" />
        </colgroup>

        <thead>
          <tr className="bg-neutral-100">
            {[
              "Clichê",
              "Tintas do arquivo",
              "Lineatura",
              "Ângulo",
              "HD",
              "Curva",
            ].map((t, i) => (
              <th
                key={t}
                className={`relative py-1 px-1 text-xs font-medium text-center ${
                  i < 5
                    ? "after:absolute after:content-[''] after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-6 after:w-px after:bg-gray-300"
                    : ""
                }`}
              >
                {t}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {colors.map((color, i) => (
            <tr key={i} className="border-b last:border-b-0">
              <td className="py-[2px] px-1 text-center">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={color.recordCliche}
                  readOnly
                />
              </td>

              <td className="py-[2px] px-1 text-left">
                <div className="flex items-center gap-1">
                  <span
                    className="w-4 h-4 rounded-sm block"
                    style={{ backgroundColor: color.ink || "transparent" }}
                  />
                  {getColorNameByHex(color.ink ?? undefined)}
                </div>
              </td>

              <td
                title={String(color.lineature ?? "")}
                className="py-[2px] px-1 text-center break-words whitespace-normal"
              >
                {color.lineature}
              </td>

              <td className="py-[2px] px-1 text-center">{color.angle}</td>

              <td
                title={color.dotType || undefined}
                className="py-[2px] px-1 text-center break-words whitespace-normal"
              >
                {color.dotType}
              </td>

              <td
                title={color.curve || undefined}
                className="py-[2px] px-1 text-center break-words whitespace-normal"
              >
                {color.curve.name}
              </td>
            </tr>
          ))}

          {Array.from({
            length: showProcedure
              ? totalRows - colorCount
              : totalRows - colorCount + 2,
          }).map((_, i) => (
            <tr key={`empty-${i}`} className="border-b">
              {Array.from({ length: 6 }).map((_, j) => (
                <td
                  key={j}
                  className={`${showProcedure ? "py-[19px] px-1" : "py-[21px] px-1"}`}
                />
              ))}
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="bg-neutral-100">
            <td colSpan={6} className="py-[8px] px-2">
              <div className="flex justify-between lg:justify-start items-center gap-6 mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold">Qtd. Cores:</span>
                  <span className="bg-black text-white px-2 py-0.5 rounded text-xs">
                    {colorCount || repairColorsQuantity}
                  </span>
                </div>
                <InfoField
                  label={"Padrão de cores:"}
                  value={colorsPattern}
                  className="max-w-[199px]"
                />
              </div>

              <div className="flex justify-between lg:justify-start items-center gap-4 mt-1">
                <InfoField label={"Perfil:"} value={profileName} />

                <InfoField label={"Trap:"} value={trap} suffix="mm" />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>

      {showProcedure && (
        <div className="mt-2">
          <label className="block text-sm">Procedimentos:</label>
          <div className="relative border rounded-[10px] border-black p-2 h-[65px] overflow-y-auto">
            <span className="relative text-xs text-black break-words whitespace-pre-wrap">
              {procedure}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

interface DimensionsTableProps {
  rows: MeasureRow[];
  totalRows: number;
  budget: string | number;
  totalPrice: number;
  totalMeasuresCliche: string | number;
  showPrices: boolean;
}

const DimensionsTable: React.FC<DimensionsTableProps> = ({
  rows,
  totalRows,
  totalPrice,
  totalMeasuresCliche,
  showPrices,
}) => {
  const measuresCount = rows.length;

  return (
    <div className="inline-block align-top w-[39%] ml-[1%]">
      <h2 className="text-lg mb-1 text-center lg:text-left mt-1">Medidas</h2>

      <table
        className="w-full table-fixed border-collapse"
        style={{
          borderTopRightRadius: "12px",
          borderBottomRightRadius: "12px",
          overflow: "hidden",
        }}
      >
        <colgroup>
          <col className="w-1/5" />
          <col className="w-1/5" />
          <col className="w-1/5" />
          <col className="w-1/5" />
        </colgroup>

        <thead>
          <tr className="bg-neutral-100">
            {["Largura", "Altura", "Qtde", "cm²"].map((t, i) => (
              <th
                key={t}
                className={`relative py-1 px-1 text-xs font-medium text-center ${
                  i < 3
                    ? "after:absolute after:content-[''] after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-6 after:w-px after:bg-gray-300"
                    : ""
                }`}
              >
                {t}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-1 text-center">{row.width}</td>
              <td className="px-1 text-center">{row.height}</td>
              <td className="px-1 text-center">{row.quantity}</td>
              <td className="px-1 text-center">{row.totalMeasure}</td>
            </tr>
          ))}

          {Array.from({ length: totalRows - measuresCount }).map((_, i) => (
            <tr key={`empty-m-${i}`} className="border-b">
              {Array.from({ length: 3 }).map((_, j) => (
                <td key={j} className="py-[10px] px-1" />
              ))}
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="bg-neutral-100">
            <td colSpan={4} className="px-3 pt-1 text-xs font-medium">
              <div className="flex justify-end gap-1 h-[20px]">
                <span className="text-right">
                  <strong>Metragem Total:</strong>
                </span>
                <span className="text-right">{totalMeasuresCliche} cm²</span>
              </div>
            </td>
          </tr>

          <tr className="bg-neutral-100">
            <td colSpan={4} className="px-3 pb-1 text-xs">
              <div className="flex justify-end gap-1 h-[20px]">
                {showPrices && (
                  <>
                    <span className="text-right">
                      <strong>Valor Total:</strong>
                    </span>
                    <span className="text-right">
                      {formatPrice({ price: totalPrice, digits: 2 })}
                    </span>
                  </>
                )}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

interface ColorsAndDimensionsProps {
  colors: any;
  repairColorsQuantity?: number;
  measures: MeasureRow[];
  colorsTableRows?: number;
  dimensionsTableRows?: number;
  budget: string | number;
  totalPrice: number;
  totalMeasuresCliche: string | number;
  trap: number;
  colorsPattern: string;
  profileName: string;
  showPrices: boolean;
  procedure?: string;
  showProcedure?: boolean;
}

export const ColorsAndDimensions: React.FC<ColorsAndDimensionsProps> = ({
  colors,
  repairColorsQuantity,
  measures,
  colorsTableRows = 4,
  dimensionsTableRows = 20,
  budget,
  totalPrice,
  totalMeasuresCliche,
  trap,
  colorsPattern,
  profileName,
  procedure,
  showProcedure,
  showPrices,
}) => (
  <div className="text-xs whitespace-nowrap flex">
    <ColorsTable
      colors={colors}
      repairColorsQuantity={repairColorsQuantity}
      totalRows={colorsTableRows}
      trap={trap}
      colorsPattern={colorsPattern}
      profileName={profileName}
      procedure={procedure}
      showProcedure={showProcedure}
    />

    <DimensionsTable
      rows={measures}
      totalRows={dimensionsTableRows}
      budget={budget}
      totalPrice={totalPrice}
      totalMeasuresCliche={totalMeasuresCliche}
      showPrices={showPrices}
    />
  </div>
);
