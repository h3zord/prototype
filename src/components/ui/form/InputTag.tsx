import React, { useState } from "react";
import { Controller, Control } from "react-hook-form";

interface InputTagProps {
  label?: string;
  name: string;
  control: Control<any>;
  error?: any;
  minValue?: number;
  maxValue?: number;
  sameValue?: boolean; // nova prop
  placeholder?: string;
  type?: "text" | "number" | "email";
}

const InputTag: React.FC<InputTagProps> = ({
  label,
  name,
  control,
  error,
  minValue,
  maxValue,
  sameValue = false, // valor padrão false
  placeholder,
  type = "number",
}) => {
  const [tagInput, setTagInput] = useState("");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value: tags, onChange } = field;

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const trimmedInput = tagInput.trim();

            if (!trimmedInput) return;

            let newValue: string | number = trimmedInput;

            if (type === "number") {
              let numericValue = Number(trimmedInput);
              if (Number.isNaN(numericValue)) return;

              if (minValue !== undefined && numericValue < minValue) {
                numericValue = minValue;
              }
              if (maxValue !== undefined && numericValue > maxValue) {
                numericValue = maxValue;
              }
              newValue = numericValue;
            } else if (type === "email") {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(trimmedInput)) {
                return;
              }
            }

            const newTags = Array.isArray(tags) ? [...tags] : [];

            if (!sameValue && newTags.includes(newValue)) {
              setTagInput("");
              return;
            }

            newTags.push(newValue);
            onChange(newTags);
            setTagInput("");
          }
        };

        const removeTag = (index: number) => {
          const newTags = Array.isArray(tags) ? [...tags] : [];
          newTags.splice(index, 1);
          onChange(newTags);
        };

        return (
          <div className="w-full">
            {label && (
              <label className="block mb-1 text-white whitespace-nowrap">
                {label}
              </label>
            )}

            <div
              className={`
                flex flex-wrap items-center
                min-h-[2.5rem]
                rounded-[0.25rem]
                border border-[rgba(209,213,219,0.3)]
                bg-transparent
                p-2
                hover:border-[rgba(209,213,219,0.5)]
                focus-within:ring-1 focus-within:ring-blue-500
              `}
            >
              {Array.isArray(tags) &&
                tags.map((tagValue: string | number, index: number) => (
                  <div
                    key={`${tagValue}-${index}`}
                    className="mr-2 flex items-center rounded bg-[rgb(75,75,77)] px-2 py-1 text-sm text-white"
                    title={String(tagValue)}
                  >
                    <span className="truncate max-w-[200px]">
                      {String(tagValue)}
                    </span>
                    <button
                      type="button"
                      className="ml-1 cursor-pointer text-white hover:text-white"
                      onClick={() => removeTag(index)}
                    >
                      &#x2715;
                    </button>
                  </div>
                ))}

              <input
                type={type === "number" ? "number" : "text"}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`
                            flex-1
                            no-spinner
                            bg-transparent
                            border-none
                            p-1
                            text-sm
                            text-white
                            placeholder-[rgb(131,132,137)]
                            focus:outline-none
                            placeholder:text-xs
                         `}
                placeholder={
                  placeholder || "Digite um número e pressione Enter"
                }
              />

              {(minValue !== undefined || maxValue !== undefined) && (
                <span className="ml-2 text-xs text-red-500 whitespace-nowrap">
                  {minValue !== undefined && `Mín: ${minValue}`}{" "}
                  {minValue !== undefined && maxValue !== undefined && "/"}{" "}
                  {maxValue !== undefined && `Máx: ${maxValue}`}
                </span>
              )}
            </div>

            {error?.message && typeof error.message === "string" && (
              <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default InputTag;
