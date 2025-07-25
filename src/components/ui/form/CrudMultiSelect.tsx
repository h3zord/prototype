import React from "react";
import Select, {
  components,
  OptionProps,
  MenuListProps,
  StylesConfig,
} from "react-select";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export interface Option {
  label: string;
  value: number | string;
}

interface CrudMultiSelectProps {
  label: string;
  items: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  onCreate: () => void;
  onEdit: (item: Option) => void;
  onDelete: (item: Option) => void;
  error?: any;
  loading?: boolean;
  searchPlaceholder?: string;
  createButtonLabel?: string;
  showCreateButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  customOptionComponent?: React.ComponentType<OptionProps<any, true>>; // Nova prop
}

const customStyles: StylesConfig<Option, true> = {
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
};

const OptionWithActions = (props: OptionProps<Option, true>) => {
  const { innerProps, children, data, isFocused, selectProps } = props;
  const { onEdit, onDelete, showEditButton, showDeleteButton } =
    selectProps as any;

  return (
    <div
      {...innerProps}
      className={`flex items-center justify-between px-2 py-1 cursor-pointer ${
        isFocused ? "bg-[rgba(255,255,255,0.1)]" : ""
      }`}
    >
      <div>{children}</div>
      <div className="flex space-x-3">
        {showEditButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(data);
            }}
            className="hover:text-yellow-300"
          >
            <FaEdit size={18} />
          </button>
        )}
        {showDeleteButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(data);
            }}
            className="hover:text-red-300"
          >
            <FaTrash size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

const MenuListWithCreateFirst = (props: MenuListProps<Option, true>) => {
  const { children, selectProps } = props;
  const { onCreate, createButtonLabel, showCreateButton } = selectProps as any;

  return (
    <components.MenuList {...props}>
      {showCreateButton && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onCreate && onCreate();
          }}
          className="cursor-pointer text-white px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] flex items-center"
        >
          <FaPlus size={16} className="mr-1" />
          <span>{createButtonLabel || "Cadastrar novo +"}</span>
        </div>
      )}
      {children}
    </components.MenuList>
  );
};

export const CrudMultiSelect: React.FC<CrudMultiSelectProps> = ({
  label,
  items,
  value,
  onChange,
  onCreate,
  onEdit,
  onDelete,
  error,
  loading,
  searchPlaceholder = "Carregue as opções...",
  createButtonLabel = "Cadastrar novo +",
  showCreateButton = true,
  showEditButton = true,
  showDeleteButton = true,
  customOptionComponent, // Nova prop
}) => {
  // Usar o componente customizado se fornecido, senão usar o padrão
  const OptionComponent = customOptionComponent || OptionWithActions;

  return (
    <div>
      <div className="flex items-center">
        <label className="block pr-2 text-white whitespace-nowrap">
          {label}
        </label>
      </div>
      <Select<Option, true>
        options={items}
        isMulti
        value={value}
        onChange={(selectedOption) =>
          onChange((selectedOption as Option[]) || [])
        }
        isLoading={loading}
        placeholder={loading ? "Carregando..." : searchPlaceholder}
        isClearable
        isSearchable
        classNamePrefix="react-select"
        className="rounded caret-white"
        noOptionsMessage={() => "Nenhuma opção encontrada"}
        styles={customStyles}
        components={{
          Option: OptionComponent, // Usar o componente dinâmico
          MenuList: MenuListWithCreateFirst,
        }}
        {...({
          onCreate,
          onEdit,
          onDelete,
          createButtonLabel,
          showCreateButton,
          showEditButton,
          showDeleteButton,
        } as any)}
      />
      {error?.message && typeof error.message === "string" && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default CrudMultiSelect;
