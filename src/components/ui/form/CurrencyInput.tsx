import {
  InputHTMLAttributes,
  useRef,
  useEffect,
  useState,
  ChangeEvent,
} from "react";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn,
  useFormContext,
} from "react-hook-form";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register?: UseFormRegisterReturn;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  className?: string;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  digits?: number;
}

const CurrencyInputFixed = ({
  label,
  register,
  error,
  endIcon,
  digits = 2,
  className = "w-full",
  disabled = false,
  ...inputProps
}: InputProps) => {
  const endIconRef = useRef<HTMLSpanElement>(null);
  const [endIconWidth, setEndIconWidth] = useState(0);
  const [displayValue, setDisplayValue] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);

  const formContext = useFormContext();
  const fieldValue =
    formContext && register ? formContext.watch(register.name) : undefined;

  useEffect(() => {
    if (endIconRef.current) {
      setEndIconWidth(endIconRef.current.offsetWidth);
    }
  }, [endIcon]);

  const formatCurrency = (value: string | number): string => {
    const valueStr = typeof value === "number" ? value.toString() : value;

    const numbers = valueStr.replace(/\D/g, "");

    if (numbers === "") return "";

    const amount = parseInt(numbers) / Math.pow(10, digits);

    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  const formatFromNumber = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  const unformatCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers === "") return "";

    const amount = parseInt(numbers) / Math.pow(10, digits);
    return amount.toString();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrency(inputValue);
    setDisplayValue(formatted);

    if (register) {
      const unformatted = unformatCurrency(inputValue);
      const event = {
        ...e,
        target: {
          ...e.target,
          value: unformatted,
        },
      };
      register.onChange(event);
    }
  };

  useEffect(() => {
    const valueToUse = fieldValue !== undefined ? fieldValue : inputProps.value;

    if (valueToUse === undefined || valueToUse === null) {
      return;
    }

    if (valueToUse === 0 && !hasInitialized) {
      setDisplayValue("");
      setHasInitialized(true);
      return;
    }

    // Formata o valor baseado no tipo
    let formatted = "";

    if (typeof valueToUse === "number" && valueToUse !== 0) {
      formatted = formatFromNumber(valueToUse);
    } else if (
      typeof valueToUse === "string" &&
      valueToUse !== "" &&
      valueToUse !== "0"
    ) {
      // Se for string com vírgula, usa como está
      if (valueToUse.includes(",")) {
        formatted = valueToUse;
      } else {
        // Tenta converter para número
        const numValue = parseFloat(valueToUse);
        if (!isNaN(numValue) && numValue !== 0) {
          formatted = formatFromNumber(numValue);
        }
      }
    }

    // Só atualiza se o valor formatado for diferente
    if (formatted !== displayValue) {
      console.log(`CurrencyInput ${label} - Updating display:`, {
        from: displayValue,
        to: formatted,
      });
      setDisplayValue(formatted);
      setHasInitialized(true);
    }
  }, [fieldValue, inputProps.value, digits, label]); // Adicionei label nas deps para o console.log

  return (
    <div className="flex flex-col relative justify-center">
      {label && <label className="text-white mb-1 text-md">{label}</label>}
      <div className={`relative w-full ${disabled ? "bg-white/10" : ""}`}>
        {endIcon && (
          <span
            ref={endIconRef}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 outline-none text-gray-500"
          >
            {endIcon}
          </span>
        )}
        <input
          {...(register ? { ...register, onChange: handleChange } : {})}
          {...inputProps}
          value={displayValue}
          onChange={register ? handleChange : inputProps.onChange}
          disabled={disabled}
          style={{
            paddingLeft: endIcon ? `${endIconWidth + 12}px` : "",
          }}
          className={`bg-transparent outline-none border placeholder-gray-500 p-2 rounded h-10 text-left
           ${className} ${
             disabled
               ? "text-white/50 border-white/10 cursor-default"
               : "hover:border-[rgba(209,213,219,0.5)] border-gray-300/[.30]"
           }`}
        />
      </div>
      {error && (
        <div className="text-red-500 mt-1 text-sm break-words">
          {typeof error?.message === "string" ? error.message : ""}
        </div>
      )}
    </div>
  );
};

export default CurrencyInputFixed;
