import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BsThreeDots } from "react-icons/bs";

interface MoreActionsMenuProps {
  actions: { label: React.ReactNode; onClick: () => void }[];
}

const MoreActionsMenu: React.FC<MoreActionsMenuProps> = ({ actions }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className=" rounded hover:bg-gray-500 focus:outline-none">
          <BsThreeDots className="h-5 w-5" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="bg-gray-700 rounded shadow-lg z-40 mt-2 p-1"
        align="end"
      >
        {actions.map((action, index) => (
          <DropdownMenu.Item
            key={index}
            onSelect={action.onClick}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-500 cursor-pointer"
          >
            {action.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default MoreActionsMenu;
