import {
  InputHTMLAttributes,
  useRef,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn,
} from "react-hook-form";
import { withHookFormMask } from "use-mask-input";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register?: UseFormRegisterReturn;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  className?: string;
  endIcon?: React.ReactNode;
  disabled?: boolean;
}

const IntegerInput = ({
  label,
  register,
  error,
  endIcon,
  className = "w-full",
  disabled = false,
  ...inputProps
}: InputProps) => {
  const endIconRef = useRef<HTMLSpanElement>(null);
  const [endIconWidth, setEndIconWidth] = useState(0);

  useEffect(() => {
    if (endIconRef.current) {
      setEndIconWidth(endIconRef.current.offsetWidth);
    }
  }, [endIcon]);

  const registerProps = useMemo(() => {
    if (register) {
      return withHookFormMask(register, "integer", {
        allowMinus: false,
        rightAlign: false,
        jitMasking: true,
        autoUnmask: true,
        unmaskAsNumber: true,
        showMaskOnHover: false,
      });
    }
    return register;
  }, [register]);

  return (
    <div className="flex flex-col relative justify-center">
      {label && (
        <label className="text-white whitespace-nowrap pb-1">{label}</label>
      )}
      <div className={`relative w-full ${disabled ? "bg-white/10" : ""}`}>
        <input
          {...registerProps}
          {...inputProps}
          disabled={disabled}
          style={{
            paddingRight: endIcon ? `${endIconWidth + 12}px` : undefined,
          }}
          className={`bg-transparent outline-none border placeholder-gray-500 p-2 rounded h-10
            ${className} ${
              disabled
                ? "text-white/50 border-white/10 cursor-default"
                : "hover:border-[rgba(209,213,219,0.5)] border-gray-300/[.30]"
            }`}
        />
        {endIcon && (
          <span
            ref={endIconRef}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 outline-none"
          >
            {endIcon}
          </span>
        )}
      </div>
      {error?.message && (
        <div className="text-red-500 mt-1 text-sm break-words">
          {String(error.message)}
        </div>
      )}
    </div>
  );
};

export default IntegerInput;
