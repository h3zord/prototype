import React from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import { FieldError, Control, Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("pt-BR", ptBR);

interface RangeDatePickerProps {
  label: string;
  name: string;
  control: Control<any>;
  error?: FieldError;
  placeholder?: string;
}

const RangeDatePicker: React.FC<RangeDatePickerProps> = ({
  label,
  name,
  control,
  error,
  placeholder,
}) => {
  return (
    <div className="flex flex-col relative">
      {label && (
        <label className="block text-white whitespace-nowrap pb-1">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DatePicker
              selected={field.value?.[0] ? new Date(field.value[0]) : null}
              onChange={(dates) => {
                const [start, end] = dates;
                const isoDates = [
                  start ? start.toISOString() : null,
                  end ? end.toISOString() : null,
                ];
                field.onChange(isoDates);
              }}
              startDate={field.value?.[0] ? new Date(field.value[0]) : null}
              endDate={field.value?.[1] ? new Date(field.value[1]) : null}
              selectsRange
              isClearable
              showYearDropdown
              showMonthDropdown
              scrollableYearDropdown
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              wrapperClassName="w-full min-w-[260px]"
              className="bg-transparent outline-none border placeholder-gray-500 border-gray-300/[.30] hover:border-gray-400 p-2 rounded w-full h-10"
              calendarClassName="border-none rounded"
              placeholderText={placeholder ?? "Selecione um intervalo"}
            />
          )}
        />
      </div>

      {error && (
        <div className="text-red-500 mt-1 text-sm break-words">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default RangeDatePicker;
