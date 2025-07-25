import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/components/ui/select";

export interface Option {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Option[];
  triggerClassName?: string;
  contentClassName?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  placeholder,
  options,
  triggerClassName = "bg-[#4a4a4c] border-[#6a6a6c] text-white",
  contentClassName = "bg-[#3a3a3c] border-[#6a6a6c]",
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={triggerClassName}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className={contentClassName}>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value} className="text-white">
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
