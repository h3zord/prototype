import { ButtonHTMLAttributes } from "react";

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  number: number;
  isSelected: boolean;
}

const FilterButton = ({
  name,
  number,
  isSelected,
  ...rest
}: FilterButtonProps) => {
  const getButtonStyles = () => {
    return isSelected
      ? "bg-orange-400 hover:bg-orange-300 text-gray-800"
      : "bg-gray-700 hover:bg-gray-400 text-white";
  };

  return (
    <button
      className={`py-2 px-4 border-none hover:border-none hover:text-gray-800 min-h-[60px] focus:outline-none w-52 flex flex-col items-center ${getButtonStyles()}`}
      {...rest}
    >
      <span className="text-lg">{name}</span>
      <span className="text-lg">{number}</span>
    </button>
  );
};

export default FilterButton;

//exemplo de uso:

{
  /* <div className="flex gap-4 py-5">
  <FilterButton
    name="Filtro 1"
    number={10}
    isSelected={selectedButton === 1}
    onClick={() => handleButtonClick(1)}
  />
  <FilterButton
    name="Filtro 2"
    number={20}
    isSelected={selectedButton === 2}
    onClick={() => handleButtonClick(2)}
  />
  <FilterButton
    name="Filtro 3"
    number={30}
    isSelected={selectedButton === 3}
    onClick={() => handleButtonClick(3)}
  />
</div>; */
}
