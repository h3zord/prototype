import { UseFormRegisterReturn } from "react-hook-form";

interface CheckboxProps {
  label: string;
  register: UseFormRegisterReturn;
  className?: string;
  onChange?: (checked: boolean) => void; // Add an onChange prop
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  register,
  className,
  onChange,
}) => {
  return (
    <label className={`flex items-center space-x-2 w-fit ${className}`}>
      <input
        type="checkbox"
        {...register}
        onChange={(e) => {
          register.onChange(e); // Keep React Hook Form's behavior
          onChange?.(e.target.checked); // Trigger the custom onChange callback
        }}
        className="h-4 w-4 border-2 focus:outline-none accent-orange-400 border-gray-300 rounded-full bg-transparent checked:bg-orange-400 checked:border-orange-400"
      />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
