import Select, { MultiValue, components, OptionProps } from "react-select";
import { Controller, Control } from "react-hook-form";
import { Check } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface GroupedOption {
  label: string;
  options: Option[];
}

interface SelectMultiFieldWithSelectAllProps {
  label: string;
  options: Option[] | GroupedOption[];
  control: Control<any>;
  name: string;
  error?: any;
  loading?: boolean;
  defaultValue?: MultiValue<Option>;
  onChange?: (selectedOption: MultiValue<Option>) => void;
  selectAllText?: string;
}

const SELECT_ALL_VALUE = "__SELECT_ALL__";

const SelectMultiFieldWithSelectAll: React.FC<
  SelectMultiFieldWithSelectAllProps
> = ({
  label,
  options,
  control,
  name,
  error,
  loading,
  onChange,
  selectAllText = "Selecionar Todos",
}) => {
  const filterInvalidValues = (
    selectedOptions: MultiValue<Option> | null
  ): MultiValue<Option> => {
    if (!selectedOptions) return [];

    const allOptions = (options as GroupedOption[]).some((g) => "options" in g)
      ? (options as GroupedOption[]).flatMap((group) => group.options)
      : (options as Option[]);

    return selectedOptions.filter(
      (selected) =>
        selected.value !== SELECT_ALL_VALUE &&
        allOptions.some((option) => option.value === selected.value)
    );
  };

  const getAllAvailableOptions = (): Option[] => {
    const allOptions = (options as GroupedOption[]).some((g) => "options" in g)
      ? (options as GroupedOption[]).flatMap((group) => group.options)
      : (options as Option[]);

    return allOptions;
  };

  const getOptionsWithSelectAll = () => {
    const selectAllOption: Option = {
      label: selectAllText,
      value: SELECT_ALL_VALUE,
    };

    if ((options as GroupedOption[]).some((g) => "options" in g)) {
      return [
        {
          label: "",
          options: [selectAllOption],
        },
        ...(options as GroupedOption[]),
      ];
    }

    return [selectAllOption, ...(options as Option[])];
  };

  const areAllOptionsSelected = (
    selectedOptions: MultiValue<Option>
  ): boolean => {
    const allAvailableOptions = getAllAvailableOptions();
    const selectedValues = selectedOptions
      .filter((option) => option.value !== SELECT_ALL_VALUE)
      .map((option) => option.value);

    return allAvailableOptions.every((option) =>
      selectedValues.includes(option.value)
    );
  };

  const isSelectAllSelected = (
    selectedOptions: MultiValue<Option>
  ): boolean => {
    return selectedOptions.some((option) => option.value === SELECT_ALL_VALUE);
  };

  const handleSelectionChange = (
    selectedOptions: MultiValue<Option>,
    field: any
  ) => {
    const allAvailableOptions = getAllAvailableOptions();

    const wasSelectAllClicked = selectedOptions.some(
      (option) => option.value === SELECT_ALL_VALUE
    );
    const previouslyHadSelectAll = isSelectAllSelected(field.value || []);

    let newSelection: MultiValue<Option>;

    if (wasSelectAllClicked && !previouslyHadSelectAll) {
      newSelection = allAvailableOptions;
    } else if (!wasSelectAllClicked && previouslyHadSelectAll) {
      newSelection = [];
    } else if (wasSelectAllClicked && previouslyHadSelectAll) {
      newSelection = [];
    } else {
      const filteredOptions = selectedOptions.filter(
        (option) => option.value !== SELECT_ALL_VALUE
      );

      newSelection = filteredOptions;
    }

    const finalSelection = filterInvalidValues(newSelection);
    field.onChange(finalSelection);
    onChange?.(finalSelection);
  };

  const CustomOption = (props: OptionProps<Option, true>) => {
    const { data, isSelected } = props;
    const isSelectAll = data.value === SELECT_ALL_VALUE;

    return (
      <components.Option {...props}>
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 border border-gray-400 rounded flex items-center justify-center ${
              isSelected ? "bg-[#f9a853] border-[#f9a853]" : "bg-transparent"
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className={isSelectAll ? "font-semibold" : ""}>
            {data.label}
          </span>
        </div>
      </components.Option>
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

                const allSelected = areAllOptionsSelected(filteredValue);

                const displayValue = filteredValue;

                if (
                  JSON.stringify(filteredValue) !== JSON.stringify(field.value)
                ) {
                  field.onChange(filteredValue);
                  onChange?.(filteredValue);
                }

                return (
                  <Select
                    {...field}
                    options={getOptionsWithSelectAll()}
                    onChange={(selectedOption) =>
                      handleSelectionChange(selectedOption, field)
                    }
                    isMulti
                    value={displayValue}
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
                    components={{
                      Option: (props) => {
                        const isSelectAll =
                          props.data.value === SELECT_ALL_VALUE;
                        const shouldSelectAllBeSelected = allSelected;

                        return (
                          <CustomOption
                            {...props}
                            isSelected={
                              isSelectAll
                                ? shouldSelectAllBeSelected
                                : props.isSelected
                            }
                          />
                        );
                      },
                    }}
                    hideSelectedOptions={false}
                    closeMenuOnSelect={false}
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
                      option: (base, { isFocused, isSelected, data }) => ({
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
                        fontWeight:
                          data.value === SELECT_ALL_VALUE ? "bold" : "normal",
                        borderBottom:
                          data.value === SELECT_ALL_VALUE
                            ? "1px solid rgba(209, 213, 219, 0.3)"
                            : "none",
                        marginBottom:
                          data.value === SELECT_ALL_VALUE ? "4px" : "0",
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
                        fontWeight: "normal",
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "rgba(75, 75, 77, 0.8)",
                          color: "#fff",
                        },
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

export default SelectMultiFieldWithSelectAll;
