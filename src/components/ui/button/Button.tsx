import {
  ButtonHTMLAttributes,
  ReactNode,
  useRef,
  useEffect,
  useState,
} from "react";
import LoadingIcon from "../loading/LoadingIcon";

export interface ButtonBaseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  onClick?: (e: any) => void;
  className?: string;
}

const Button = ({
  children,
  loading,
  variant = "primary",
  onClick,
  className = "",
  ...rest
}: ButtonBaseProps) => {
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current && !loading) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, [loading]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  const getVariantColor = () => {
    if (variant === "secondary") {
      return "bg-gray-400 hover:bg-gray-300 disabled:hover:bg-gray-400";
    }
    if (variant === "danger") {
      return "bg-red-400 hover:bg-red-300 disabled:hover:bg-red-400";
    }
    return "bg-orange-400 hover:bg-orange-300 disabled:hover:bg-orange-400";
  };

  const defaultClasses = `text-xs text-gray-800 font-medium px-2 py-1 min-h-[24px] rounded disabled:opacity-50 disabled:cursor-not-allowed ${getVariantColor()}`;

  return (
    <button
      ref={buttonRef}
      className={`${defaultClasses} ${className}`}
      style={{ width: loading ? buttonWidth : undefined }}
      onClick={handleClick}
      {...rest}
    >
      {loading ? <LoadingIcon className="w-4 h-4" /> : <span>{children}</span>}
    </button>
  );
};

export default Button;
