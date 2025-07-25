import { InputHTMLAttributes, useState } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder: string;
  onChange: (e: any) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  className = "",
  placeholder,
  onChange,
  ...inputProps
}) => {
  const [debouceTimeout, setDebouceTimeout] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

  const handleChange = (e: any) => {
    clearTimeout(debouceTimeout);
    const timeout = setTimeout(() => onChange(e.target.value), 1000);
    setDebouceTimeout(timeout);
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        placeholder={placeholder}
        onChange={handleChange}
        className={`bg-gray-700 border p-2 rounded outline-none border-gray-500 w-full h-10 ${className}`}
        {...inputProps}
      />
    </div>
  );
};

export default SearchInput;
