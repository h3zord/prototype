import Select, { MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { Controller, Control } from "react-hook-form";

export interface Option {
  label: string;
  value: string;
}

interface GroupedOption {
  label: string;
  options: Option[];
}

interface SelectMultiFieldProps {
  label: string;
  options: Option[] | GroupedOption[];
  control: Control<any>;
  name: string;
  error?: any;
  loading?: boolean;
  defaultValue?: MultiValue<Option>;
  onChange?: (selectedOption: MultiValue<Option>) => void;
  isCreatable?: boolean;
  onCreateOption?: (inputValue: string) => Option | void;
  createOptionPosition?: "first" | "last";
  formatCreateLabel?: (inputValue: string) => string;
}

const MultiSelectWithCreate: React.FC<SelectMultiFieldProps> = ({
  label,
  options,
  control,
  name,
  error,
  loading,
  onChange,
  isCreatable = false,
  onCreateOption,
  createOptionPosition = "last",
  formatCreateLabel,
}) => {
  const filterInvalidValues = (
    selectedOptions: MultiValue<Option> | null,
  ): MultiValue<Option> => {
    if (!selectedOptions) return [];

    const allOptions = (options as GroupedOption[]).some((g) => "options" in g)
      ? (options as GroupedOption[]).flatMap((group) => group.options)
      : (options as Option[]);

    return selectedOptions.filter((selected) =>
      allOptions.some((option) => option.value === selected.value),
    );
  };

  const handleCreateOption = (inputValue: string): Option => {
    // Se há uma função customizada para criar opção, usa ela
    if (onCreateOption) {
      const customOption = onCreateOption(inputValue);
      if (customOption) return customOption;
    }

    // Função padrão para criar nova opção
    const newOption: Option = {
      value: inputValue.charAt(0).toUpperCase() + inputValue.slice(1),
      label: inputValue,
    };

    return newOption;
  };

  const SelectComponent = isCreatable ? CreatableSelect : Select;

  const creatableProps = isCreatable
    ? {
        createOptionPosition,
        formatCreateLabel:
          formatCreateLabel ||
          ((inputValue: string) => `Criar "${inputValue}"`),
        isValidNewOption: (inputValue: string) => {
          // Valida se a nova opção é válida
          return inputValue.trim().length > 0;
        },
      }
    : {};

  return (
    <div>
      {label && (
        <>
          <label className="block text-white whitespace-nowrap mb-1">
            {label}
          </label>
          <div className="relative w-full">
            <Controller
              name={name}
              control={control}
              render={({ field }) => {
                const filteredValue = isCreatable
                  ? field.value || []
                  : filterInvalidValues(field.value);

                if (
                  !isCreatable &&
                  JSON.stringify(filteredValue) !== JSON.stringify(field.value)
                ) {
                  field.onChange(filteredValue);
                  onChange?.(filteredValue);
                }

                return (
                  <SelectComponent
                    {...field}
                    {...creatableProps}
                    options={options}
                    onChange={(selectedOption) => {
                      const selectedValue = selectedOption || [];

                      if (!isCreatable) {
                        const filteredSelected =
                          filterInvalidValues(selectedValue);
                        field.onChange(filteredSelected);
                        onChange?.(filteredSelected);
                      } else {
                        field.onChange(selectedValue);
                        onChange?.(selectedValue);
                      }
                    }}
                    onCreateOption={
                      isCreatable
                        ? (inputValue: string) => {
                            const newOption = handleCreateOption(inputValue);
                            const currentValue = field.value || [];
                            const newValue = [...currentValue, newOption];
                            field.onChange(newValue);
                            onChange?.(newValue);
                          }
                        : undefined
                    }
                    isMulti
                    value={filteredValue}
                    isLoading={loading}
                    placeholder={
                      loading
                        ? "Carregando..."
                        : isCreatable
                          ? "Selecione ou crie uma opção"
                          : "Selecione uma opção"
                    }
                    isClearable
                    isSearchable
                    classNamePrefix="react-select"
                    className="rounded caret-white"
                    noOptionsMessage={({ inputValue }) =>
                      isCreatable && inputValue
                        ? `Pressione Enter para criar "${inputValue}"`
                        : "Nenhuma opção encontrada"
                    }
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "transparent",
                        borderColor: "rgba(209, 213, 219, 0.3)",
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
                        zIndex: 9999,
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
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
                        color: "white",
                      }),
                      multiValue: (base) => ({
                        ...base,
                        background: "rgb(75, 75, 77)",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: "#fff",
                      }),
                    }}
                  />
                );
              }}
            />
          </div>
        </>
      )}
      {error?.message && typeof error.message === "string" && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default MultiSelectWithCreate;
