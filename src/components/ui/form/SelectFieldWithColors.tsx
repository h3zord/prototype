import React, { useMemo, Component } from "react";
import Select, { createFilter, components } from "react-select";
import { FixedSizeList as List } from "react-window";
import { Controller, Control } from "react-hook-form";

interface SelectFieldWithColorsProps {
  label?: string;
  options: { label: string; value: string }[]; // `label` é o nome da cor e `value` é o hex.
  control: Control<any>;
  name: string;
  error?: any;
  loading?: boolean;
  onChange?: (option: { label: string; value: string }) => void;
  defaultValue?: { label: string; value: string } | null;
  value?: { label: string; value: string } | null;
}

const height = 50; // Altura de cada item na lista

// Virtualized MenuList Component
class MenuList extends Component<any> {
  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }
}

const SelectFieldWithColors: React.FC<SelectFieldWithColorsProps> = ({
  label,
  options,
  control,
  name,
  onChange,
  error,
  loading,
}) => {
  const memorizedOptions = useMemo(() => options, [options]);

  return (
    <div>
      <div className="flex items-center">
        {label && (
          <label className="block pr-2 text-white whitespace-nowrap">
            {label}
          </label>
        )}
        <div className="w-full">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={memorizedOptions}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption || null);
                  onChange?.(selectedOption);
                }}
                value={field.value || null}
                isLoading={loading}
                placeholder={loading ? "Carregando..." : "Selecione uma cor"}
                isClearable
                isSearchable
                filterOption={createFilter({ ignoreAccents: false })}
                classNamePrefix="react-select"
                className={`rounded caret-white`}
                noOptionsMessage={() => "Nenhuma opção encontrada"}
                components={{ MenuList }}
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
                    width: 300,
                  }),
                  input: (base) => ({
                    ...base,
                    color: "white",
                  }),
                  option: (base, { isFocused, isSelected, data }) => ({
                    ...base,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: isFocused
                      ? "rgba(255, 255, 255, 0.1)"
                      : isSelected
                        ? "rgba(107, 114, 128, 0.5)"
                        : "transparent",
                    color: "white",
                    "&:before": {
                      content: '""',
                      display: "inline-block",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: data.value,
                    },
                  }),
                  singleValue: (base, { data }) => ({
                    ...base,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "white",
                    "&:before": {
                      content: '""',
                      display: "inline-block",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: data.value,
                    },
                  }),
                }}
              />
            )}
          />
        </div>
      </div>
      {error?.message && typeof error.message === "string" && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default SelectFieldWithColors;
