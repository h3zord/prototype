import {
  Controller,
  Control,
  useWatch,
  UseFormSetValue,
  UseFormRegisterReturn,
} from "react-hook-form";
import Select from "react-select";
import { useEffect } from "react";

interface OptionType {
  label: string;
  value: string;
}

interface InputWithPrefixProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  name: string; // campo serial completo (prefix/value)
  prefixName: string;
  inputName: string; // campo de número de série puro
  register?: UseFormRegisterReturn;
  error?: any;
  options: OptionType[];
  disabled?: boolean;
  selectPlaceholder?: string;
  inputPlaceholder?: string;
}

const InputWithPrefix: React.FC<InputWithPrefixProps> = ({
  control,
  setValue,
  name,
  prefixName,
  inputName,
  register,
  error,
  options,
  selectPlaceholder,
  inputPlaceholder,
  disabled = false,
}) => {
  const prefix = useWatch({ control, name: prefixName });
  const serial = useWatch({ control, name: inputName });

  useEffect(() => {
    if (prefix && serial) {
      setValue(name, `${prefix.value}/${serial}`);
    } else if (prefix && !serial) {
      setValue(name, prefix.value);
    } else if (!prefix && serial) {
      setValue(name, serial);
    } else {
      setValue(name, "");
    }
  }, [prefix, serial, setValue, name]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const value = e.target.value.replace(/\//g, "");
    onChange(value);
  };

  return (
    <div className="flex flex-col">
      <label className="block text-white whitespace-nowrap mb-1">
        N° Série:
      </label>
      <div className="flex w-full">
        <Controller
          name={prefixName}
          control={control}
          rules={{
            required: "Prefixo é obrigatório",
          }}
          render={({ field, fieldState }) => (
            <div className="w-1/3">
              <Select
                {...field}
                options={options}
                isDisabled={disabled}
                placeholder={selectPlaceholder || "Prefixo"}
                isClearable
                className="rounded-r-none"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: disabled
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                    borderColor: disabled
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(209, 213, 219, 0.3)",
                    boxShadow: "none",
                    borderRadius: "0.25rem",
                    minHeight: "2.5rem",
                    "&:hover": {
                      borderColor: "rgba(209, 213, 219, 0.5)",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "rgb(96, 96, 98)",
                  }),
                  indicatorSeparator: (base) => ({
                    ...base,
                    backgroundColor: "rgba(209, 213, 219, 0.3)",
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: "rgba(209, 213, 219, 0.3)",
                    "&:hover": {
                      color: "white",
                    },
                  }),
                  clearIndicator: (base) => ({
                    ...base,
                    color: "rgba(209, 213, 219, 0.3)",
                    "&:hover": {
                      color: "white",
                    },
                  }),
                  input: (base) => ({
                    ...base,
                    color: "white",
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
                  singleValue: (base) => ({
                    ...base,
                    color: disabled ? "rgba(255, 255, 255, 0.5)" : "white",
                  }),
                }}
              />
              {fieldState.error?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name={inputName}
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <input
              {...field}
              {...register}
              value={value || ""}
              onChange={(e) => {
                handleInputChange(e, (v) => {
                  onChange(v);
                  register?.onChange?.(e); // Garante que a validação seja ativada
                });
              }}
              disabled={disabled}
              placeholder={inputPlaceholder || "Digite o número de série"}
              className={`w-2/3 bg-transparent border border-l-0 rounded-l-none border-gray-300/[.30] text-white p-2 h-10 outline-none ${
                disabled
                  ? "bg-white/10 text-white/50 cursor-default"
                  : "hover:border-[rgba(209,213,219,0.5)]"
              }`}
            />
          )}
        />
      </div>
      {error?.message && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default InputWithPrefix;
