import React from "react";

export interface IconButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  link?: string;
  type?: "button" | "submit" | "reset";
  label?: string;
  border?: boolean;
  borderButton?: string;
  disabled?: boolean; // ← Adicionado
  title?: string; // ← Adicionado
  className?: string; // ← Adicionado
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  type = "button",
  label,
  border = false,
  borderButton,
  disabled = false, // ← Adicionado com valor padrão
  title, // ← Adicionado
  className, // ← Adicionado
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled} // ← Adicionado
      title={title} // ← Adicionado
      className={`
        flex items-center justify-center appearance-none m-0 bg-transparent 
        shadow-none outline-none focus:outline-none 
        ${borderButton ? borderButton : "border-none p-0"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className || ""}
      `
        .trim()
        .replace(/\s+/g, " ")} // ← Melhorada a concatenação de classes
    >
      <div
        className={`${border ? "border-l border-gray-300/[.30]" : ""} flex items-start`}
      >
        <span className="pr-2">{label}</span>
        <span>{icon}</span>
      </div>
    </button>
  );
};

export default IconButton;
