interface PageSizeSelectProps {
  pageSize: number;
  options: number[];
  onChange: (value: number) => void;
  className?: string;
  showAllLabel?: string;
  totalCount?: number;
}

const PageSizeSelect: React.FC<PageSizeSelectProps> = ({
  pageSize,
  options,
  onChange,
  className = "",
  showAllLabel = "Todos",
  totalCount = 0,
}) => {
  const displayValue = () => {
    if (options.includes(pageSize)) {
      return pageSize;
    }

    if (totalCount > 0 && pageSize >= totalCount && options.includes(-1)) {
      return -1;
    }

    return options[0];
  };

  return (
    <div className="flex gap-2 items-center">
      <select
        value={displayValue()}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`bg-gray-800 border p-1 rounded outline-none border-gray-500 h-9 ${className} cursor-not-allowed`}
        disabled={true}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            Mostrar {size === -1 ? showAllLabel : size}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PageSizeSelect;
