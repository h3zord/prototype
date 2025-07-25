export interface IconButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  link?: string;
  type?: "button" | "submit" | "reset";
  label?: string;
  border?: boolean;
  borderButton?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  type = "button",
  label,
  border = false,
  borderButton,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center appearance-none m-0 bg-transparent shadow-none outline-none focus:outline-none ${borderButton ? borderButton : "border-none p-0"}`}
    >
      <div
        className={`${border ? "border-l border-gray-300/[.30]" : ""}   flex items-start`}
      >
        <span className="pr-2">{label}</span>
        <span>{icon}</span>
      </div>
    </button>
  );
};

export default IconButton;
