import React from "react";
import Select from "react-select";
import { Controller, Control } from "react-hook-form";

interface OptionType {
  label: string | JSX.Element;
  value: number | string;
  icon?: JSX.Element;
}

interface SelectFieldProps {
  label?: string;
  options: OptionType[];
  control: Control<any>;
  name: string;
  error?: any;
  loading?: boolean;
  disabled?: boolean;
  onChange?: (option: OptionType) => void;
  defaultValue?: OptionType | null;
  value?: OptionType | null;
  warning?: string;
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  control,
  name,
  onChange,
  error,
  disabled = false,
  loading,
  warning,
  placeholder,
}) => {
  return (
    <div>
      {label && (
        <label className="block borde text-white whitespace-nowrap mb-1">
          {label}
          <span className="ml-2 text-red-500">{warning}</span>
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            onChange={(selectedOption) => {
              field.onChange(selectedOption || null);
              onChange?.(selectedOption as OptionType);
            }}
            maxMenuHeight={220} // Altura máxima do menu em pixels
            isDisabled={disabled}
            value={field.value || null}
            isLoading={loading}
            placeholder={
              loading ? "Carregando..." : placeholder || "Selecione uma opção"
            }
            isClearable
            isSearchable
            classNamePrefix="react-select"
            className="rounded caret-white"
            noOptionsMessage={() => "Nenhuma opção encontrada"}
            formatOptionLabel={(option: OptionType) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                {option.icon && (
                  <span style={{ marginRight: 8 }}>{option.icon}</span>
                )}
                <span>{option.label}</span>
              </div>
            )}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: disabled
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
                borderColor: disabled
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(209, 213, 219, 0.3)",
                boxShadow: "none",
                borderRadius: "0.25rem",
                minHeight: "2.5rem",
                "&:hover": {
                  borderColor: "rgba(209, 213, 219, 0.5)",
                },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "rgb(96, 96, 98)",
              }),
              indicatorSeparator: (base) => ({
                ...base,
                backgroundColor: "rgba(209, 213, 219, 0.3)",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "rgba(209, 213, 219, 0.3)",
                "&:hover": {
                  color: "white",
                },
              }),
              clearIndicator: (base) => ({
                ...base,
                color: "rgba(209, 213, 219, 0.3)",
                "&:hover": {
                  color: "white",
                },
              }),
              input: (base) => ({
                ...base,
                color: "white",
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isFocused
                  ? "rgba(255, 255, 255, 0.1)"
                  : isSelected
                    ? "rgba(107, 114, 128, 0.5)"
                    : "transparent",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }),
              placeholder: (base) => ({
                ...base,
                color: "rgb(131,132,137)",
              }),
              singleValue: (base) => ({
                ...base,
                color: disabled ? "rgba(255, 255, 255, 0.5)" : "white",
              }),
            }}
          />
        )}
      />
      {error?.message && typeof error.message === "string" && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default SelectField;
