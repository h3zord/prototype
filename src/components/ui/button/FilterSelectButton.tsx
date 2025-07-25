import { useState, useRef, useEffect } from "react";
import Select, { MultiValue } from "react-select";

interface Option {
  label: string;
  value: number | string;
}

interface FilterSelectButtonProps {
  name: string;
  options: Option[];
  defaultValue?: MultiValue<Option>;
  placeholder?: string;
  onChange?: (selectedOptions: MultiValue<Option>) => void;
}

const FilterSelectButton = ({
  name,
  options,
  defaultValue,
  placeholder = "Todas",
  onChange,
}: FilterSelectButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>(
    defaultValue || [],
  );
  const ref = useRef<HTMLDivElement>(null);

  // Fecha o select ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectChange = (options: MultiValue<Option>) => {
    setSelectedOptions(options || []);
    onChange?.(options || []);
  };

  const getButtonStyle = () => {
    return selectedOptions.length > 0
      ? "bg-orange-400 hover:bg-orange-300 text-gray-800"
      : "bg-gray-700 hover:bg-gray-400 text-white";
  };

  return (
    <div ref={ref} className="relative w-52">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`py-2 px-4 border-none w-full flex flex-col items-center min-h-[60px] focus:outline-none ${getButtonStyle()}`}
      >
        <span className="text-lg">{name}</span>
        <span className="text-lg">
          {selectedOptions.length > 0
            ? selectedOptions.map((opt) => opt.label).join(", ")
            : placeholder}
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full bg-gray-800 rounded mt-2 shadow-lg">
          <Select
            options={options}
            isMulti
            onChange={handleSelectChange}
            value={selectedOptions}
            placeholder="Selecione..."
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "transparent",
                borderColor: "rgba(209, 213, 219, 0.3)",
                boxShadow: "none",
                "&:hover": {
                  borderColor: "rgba(209, 213, 219, 0.5)",
                },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "rgb(96, 96, 98)",
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
        </div>
      )}
    </div>
  );
};

export default FilterSelectButton;

//EXEMPLO DE USO:

{
  /* <FilterSelectButton name="Filtro" options={options} placeholder="Todas" />; */
}
