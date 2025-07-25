import data from "../../mocks/menuLeft";
import { usePermission } from "../../context/PermissionsContext";

interface NavbarClosedProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavbarClosed: React.FC<NavbarClosedProps> = ({ setIsMenuOpen }) => {
  const { permissions } = usePermission();

  const filteredData = data
    .map((item) => ({
      ...item,
      subtitles: item.subtitles.filter((subtitle) =>
        permissions.includes(subtitle.permission),
      ),
    }))
    .filter((item) => item.subtitles.length > 0);

  return (
    <nav
      className="bg-gray-400 text-gray-800 w-24 ml-8 rounded-lg"
      onClick={() => setIsMenuOpen((prev) => !prev)}
    >
      <ul className="p-4">
        {filteredData.map((element) => {
          return (
            <li key={element.title} className="flex items-top px-4 py-9">
              {element.icon}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavbarClosed;
