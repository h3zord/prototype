"use client";

import React, { useState } from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Button } from "../../../../components/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../../components/components/ui/popover";
import { Calendar } from "lucide-react";

export interface DateRangePickerProps {
  initialRange?: Range;
  onApply?: (range: Range) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  initialRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  },
  onApply,
}) => {
  const [selection, setSelection] = useState<Range>(initialRange);

  const handleSelect = (ranges: RangeKeyDict) => {
    const updated = ranges.selection;
    setSelection({
      startDate: updated.startDate ?? initialRange.startDate,
      endDate: updated.endDate ?? initialRange.endDate,
      key: updated.key,
    });
  };

  const handleApply = () => {
    console.log("Selected range:", selection);
    onApply?.(selection);
  };

  const startLabel = selection.startDate?.toLocaleDateString() || "";
  const endLabel = selection.endDate?.toLocaleDateString() || "";
  const summary =
    startLabel && endLabel
      ? `${startLabel} – ${endLabel}`
      : "Selecionar período";

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-between border-gray-600"
          >
            <div className="flex items-center space-x-2">
              <Calendar />
              <span>{summary}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          className="border rounded-lg shadow-lg p-0 border-gray-600"
        >
          <div className="border-gray-600">
            <DateRange
              editableDateInputs
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              ranges={[selection]}
              className="w-full rounded-md"
            />
          </div>
        </PopoverContent>
      </Popover>
      <Button
        onClick={handleApply}
        className="whitespace-nowrap border-gray-600"
      >
        Aplicar
      </Button>
    </div>
  );
};

export default DateRangePicker;
