import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { usePermission } from "../../context/PermissionsContext";
import data from "../../mocks/menuLeft";

const Navbar = () => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const { permissions } = usePermission();

  useEffect(() => {
    const allOpen = data.reduce(
      (acc, element) => {
        acc[element.title] = true;
        return acc;
      },
      {} as { [key: string]: boolean },
    );
    setOpenItems(allOpen);
  }, []);

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const filteredData = data
    .map((item) => ({
      ...item,
      subtitles: item.subtitles.filter((subtitle) =>
        permissions.includes(subtitle.permission),
      ),
    }))
    .filter((item) => item.subtitles.length > 0);

  return (
    <nav className="bg-gray-400 text-gray-800 ml-8  rounded-lg">
      <ul className="p-3">
        {filteredData.map((element) => {
          const isOpen = openItems[element.title] || false;
          return (
            <li key={element.title} className="flex items-top px-3 py-2.5">
              {element.icon}
              <div className="pl-6 w-44">
                <h3 className="font-semibold">{element.title}</h3>
                {isOpen &&
                  element.subtitles.map((subtitle) => {
                    return (
                      <Link to={subtitle.link} key={subtitle.name}>
                        <p className="font-normal">{subtitle.name}</p>
                      </Link>
                    );
                  })}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
