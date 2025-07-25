import React from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { FieldError, Control, Controller } from "react-hook-form";
import { addHours, isWeekend, startOfDay } from "date-fns";

registerLocale("pt-BR", ptBR);

interface DateInputProps {
  label: string;
  name: string;
  control: Control<any>;
  error?: FieldError;
  minDate?: Date;
  noMinDate?: boolean;
  allowPastDates?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  control,
  error,
  minDate = addHours(new Date(), 5),
  noMinDate,
  allowPastDates = false,
}) => {
  const isWeekday = (date: Date) => !isWeekend(date);

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
            <ReactDatePicker
              selected={field.value ? new Date(field.value) : null}
              onChange={(date) => {
                field.onChange(date?.toISOString());
              }}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              minDate={
                noMinDate || allowPastDates ? undefined : startOfDay(minDate)
              }
              filterDate={allowPastDates ? undefined : isWeekday}
              wrapperClassName="w-full"
              className="bg-transparent outline-none border placeholder-gray-500 border-gray-300/[.30] hover:border-gray-400 p-2 rounded w-full h-10"
              calendarClassName="border-none rounded"
              placeholderText="Selecione uma data"
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

export default DateInput;
