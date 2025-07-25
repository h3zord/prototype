import React from "react";
import Select, { components, MenuListProps, StylesConfig } from "react-select";
import { FaPlus } from "react-icons/fa";

export interface Option {
  label: string;
  value: number | string;
}

interface SelectWithCreateProps {
  label: string;
  items: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  onCreate?: () => void;
  menuOpen?: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  error?: any;
  loading?: boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
  createButtonLabel?: string;
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
    zIndex: 0,
  }),
  placeholder: (base) => ({
    ...base,
    color: "rgb(131,132,137)",
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
};

const MenuListWithCreateFirst = (props: MenuListProps<Option, true>) => {
  const { children, selectProps } = props;
  const { onCreate, createButtonLabel } = selectProps as any;

  return (
    <components.MenuList {...props}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          return onCreate && onCreate();
        }}
        className="cursor-pointer text-white px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] flex items-center"
      >
        <FaPlus size={16} className="mr-1" />
        <span>{createButtonLabel || "Cadastrar novo +"}</span>
      </div>
      {children}
    </components.MenuList>
  );
};

export const SelectWithCreate: React.FC<SelectWithCreateProps> = ({
  label,
  items,
  value,
  onChange,
  onCreate,
  menuOpen,
  setMenuOpen,
  error,
  loading,
  disabled,
  searchPlaceholder = "Selecione uma opção",
  createButtonLabel = "Criar usuário externo",
}) => {
  return (
    <div>
      <div className="flex items-center">
        <label className="block pr-2 mb-1 text-white whitespace-nowrap">
          {label}
        </label>
      </div>
      <div style={{ cursor: disabled ? "not-allowed" : "default" }}>
        <Select<Option, true>
          onMenuOpen={() => setMenuOpen(true)}
          onMenuClose={() => setMenuOpen(false)}
          menuIsOpen={menuOpen}
          options={items}
          value={value}
          onChange={(selectedOption) =>
            onChange((selectedOption as Option[]) || [])
          }
          isLoading={loading}
          placeholder={loading ? "Carregando..." : searchPlaceholder}
          isDisabled={disabled}
          isClearable
          classNamePrefix="react-select"
          className="rounded caret-white"
          menuPortalTarget={null}
          noOptionsMessage={() => "Nenhuma opção encontrada"}
          components={{
            MenuList: MenuListWithCreateFirst,
          }}
          {...{ onCreate, createButtonLabel }}
          styles={customStyles}
        />
      </div>
      {error?.message && typeof error.message === "string" && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};
