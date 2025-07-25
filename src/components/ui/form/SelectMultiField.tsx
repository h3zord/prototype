import Select, { MultiValue } from "react-select";
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
}

const SelectMultiField: React.FC<SelectMultiFieldProps> = ({
  label,
  options,
  control,
  name,
  error,
  loading,
  onChange,
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
                const filteredValue = filterInvalidValues(field.value);

                if (
                  JSON.stringify(filteredValue) !== JSON.stringify(field.value)
                ) {
                  field.onChange(filteredValue);
                  onChange?.(filteredValue);
                }

                return (
                  <Select
                    {...field}
                    options={options}
                    onChange={(selectedOption) => {
                      const filteredSelected =
                        filterInvalidValues(selectedOption);
                      field.onChange(filteredSelected);
                      onChange?.(filteredSelected);
                    }}
                    isMulti
                    value={filteredValue}
                    isLoading={loading}
                    placeholder={
                      loading ? "Carregando..." : "Selecione uma opção"
                    }
                    isClearable
                    isSearchable
                    classNamePrefix="react-select"
                    className="rounded caret-white"
                    noOptionsMessage={() => "Nenhuma opção encontrada"}
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

export default SelectMultiField;
