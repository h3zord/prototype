import Select, { MultiValue, components } from "react-select";
import { Controller, Control } from "react-hook-form";
import { useState, useRef, useEffect } from "react";

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

const TruncatedMultiSelect: React.FC<SelectMultiFieldProps> = ({
  label,
  options,
  control,
  name,
  error,
  loading,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    setContainerWidth(element.getBoundingClientRect().width);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, []);

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

  // Componente personalizado para o MultiValueContainer
  const CustomMultiValueContainer = (props: any) => {
    if (!isFocused && props.selectProps.value.length > 1) {
      // Apenas renderiza visualmente o componente quando é o primeiro ou está em foco
      const index = props.selectProps.value.findIndex(
        (val: Option) => val.value === props.data.value,
      );

      const valueComponents = props.selectProps.value.map((val: Option) => {
        // Estimar a largura aproximada do valor (20px por caractere + 36px para padding/margens)
        const estimatedWidth = val.label.length * 8 + 36;
        return { value: val, width: estimatedWidth };
      });

      // Calcular a largura acumulada
      let accumulatedWidth = 0;
      let lastVisibleIndex = 0;

      for (let i = 0; i < valueComponents.length; i++) {
        accumulatedWidth += valueComponents[i].width;

        // Considerar espaço para o contador "mais X"
        const counterWidth = i < valueComponents.length - 1 ? 50 : 0;

        if (accumulatedWidth + counterWidth > containerWidth - 50) {
          lastVisibleIndex = i - 1;
          break;
        }

        lastVisibleIndex = i;
      }

      // Se este componente está além do último visível, não renderize
      if (index > lastVisibleIndex) {
        return null;
      }

      // Se é o último visível e há mais valores, mostrar reticências
      if (
        index === lastVisibleIndex &&
        index < props.selectProps.value.length - 1
      ) {
        const remainingCount =
          props.selectProps.value.length - (lastVisibleIndex + 1);
        return (
          <>
            <components.MultiValueContainer {...props} />
            <div
              className="truncated-indicator"
              style={{
                background: "rgb(75, 75, 77)",
                borderRadius: "2px",
                margin: "2px",
                padding: "0 8px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                fontSize: "85%",
              }}
            >
              +{remainingCount}
            </div>
          </>
        );
      }
    }

    // Renderização padrão
    return <components.MultiValueContainer {...props} />;
  };

  return (
    <div ref={containerRef}>
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
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    components={{
                      MultiValueContainer: CustomMultiValueContainer,
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
                          borderColor: "rgba(219, 210, 209, 0.5)",
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

export default TruncatedMultiSelect;
