import { TextareaHTMLAttributes } from "react";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn,
} from "react-hook-form";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  register?: UseFormRegisterReturn;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  className?: string;
}

const Textarea = ({
  label,
  register,
  error,
  className = "w-full",
  ...textareaProps
}: TextareaProps) => {
  return (
    <div>
      <div className="flex relative">
        <label className="text-white whitespace-nowrap pt-[8px] pr-2">
          {label}
        </label>
        <textarea
          {...register}
          {...textareaProps}
          className={`bg-transparent outline-none border placeholder-gray-500 border-gray-300/[.30] p-2 rounded h-20 ${className}`}
        />
      </div>
      {error && (
        <div className="text-red-500 mt-1 text-sm break-words">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default Textarea;
