import { unitAbbrevOptions } from "../../../helpers/options/customer";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import { Unit } from "../../../types/models/customer";

export const UnitWithColor = ({ unit }: { unit: Unit }) => {
  const unitLabel = getLabelFromValue(unit, unitAbbrevOptions);
  return (
    <div
      className={`${unitLabel === "RS" ? "text-red-400 text-[12px]" : "text-green-400 text-[12px]"}`}
    >
      {unitLabel}
    </div>
  );
};
