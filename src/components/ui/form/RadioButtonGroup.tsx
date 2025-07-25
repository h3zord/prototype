import React from "react";
import { FaCheck } from "react-icons/fa";
import { Controller, FieldError } from "react-hook-form";

interface RadioButton {
  label: string;
  value: string;
}

interface RadioButtonGroupProps {
  label?: string;
  options: RadioButton[];
  control: any;
  name: string;
  className?: string;
  error?: FieldError | any;
  horizontal?: boolean;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  label,
  options,
  control,
  name,
  className,
  error,
  horizontal = false,
}) => {
  return (
    <div className={className}>
      {label && <p className="text-white">{label}</p>}
      {error && (
        <div className="text-red-500 mt-1 text-sm break-words pb-2">
          {error.message}
        </div>
      )}
      <div
        className={`flex ${horizontal ? "items-center justify-center " : " flex-col space-y-2"}  `}
      >
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <>
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    {...field} // Usamos apenas {...field}, não precisamos de value aqui
                    checked={field.value === option.value} // O valor selecionado será controlado pelo Controller
                    className="hidden"
                    onChange={() => field.onChange(option.value)} // Atualiza o valor no React Hook Form ao selecionar
                  />
                  <div
                    className={`w-4 h-4 flex items-center justify-center border rounded-sm transition-all duration-200 ease-in-out ${
                      field.value === option.value
                        ? "bg-orange-400 border-orange-400"
                        : "bg-gray-900 border-gray-500"
                    }`}
                  >
                    {field.value === option.value && (
                      <FaCheck className="w-3 h-3 text-gray-900" />
                    )}
                  </div>
                  <span className="text-white">{option.label}</span>
                </label>
              ))}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default RadioButtonGroup;
