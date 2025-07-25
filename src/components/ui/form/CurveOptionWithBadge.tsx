import { FaEdit, FaTrash } from "react-icons/fa";
import { TbCircleLetterG } from "react-icons/tb";
import type { OptionProps } from "react-select";

export interface Option {
  label: string;
  value: number | string;
}

interface OptionWithCustomerId extends Option {
  customerId?: number | null;
}

export const CurveOptionWithBadge = (
  props: OptionProps<OptionWithCustomerId, true>
) => {
  const { innerProps, data, isFocused, selectProps } = props;
  const { onEdit, onDelete, showEditButton, showDeleteButton } =
    selectProps as any;

  const isGeneric = data.customerId === null;

  return (
    <div
      {...innerProps}
      className={`flex items-center justify-between px-2 py-1 cursor-pointer ${
        isFocused ? "bg-[rgba(255,255,255,0.1)]" : ""
      }`}
    >
      <div className="flex items-center">
        <span className="text-white">{data.label}</span>
      </div>
      <div className="flex items-center space-x-3">
        {isGeneric && <TbCircleLetterG title="Genérica" />}
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
