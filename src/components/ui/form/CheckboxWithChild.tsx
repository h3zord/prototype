import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface CheckboxWithChildProps {
  label: string;
  secondLabel?: string;
  register: UseFormRegisterReturn;
  className?: string;
  children?: React.ReactNode;
}

const CheckboxWithChild: React.FC<CheckboxWithChildProps> = ({
  label,
  secondLabel,
  register,
  className,
  children,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className="grid grid-cols-2">
      <label className={`flex items-center w-fit ${className}`}>
        <input
          type="checkbox"
          {...register}
          className="h-4 w-4 border-2 focus:outline-none accent-orange-400 border-gray-300 rounded-md bg-transparent checked:bg-orange-400 checked:border-orange-400"
          onChange={handleCheckboxChange}
        />
        <div className="flex">
          <span className="pl-2">{label}</span>
          <span className="text-orange-300">{secondLabel}</span>
        </div>
      </label>
      <div className="pl-6 py-1">
        {React.isValidElement(children) &&
          React.cloneElement(children as React.ReactElement, {
            disabled: !isChecked,
          })}
      </div>
    </div>
  );
};

export default CheckboxWithChild;
