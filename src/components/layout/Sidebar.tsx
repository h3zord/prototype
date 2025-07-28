import { useNavigate, useLocation } from "react-router-dom";
import { BiLogOut, BiUser } from "react-icons/bi";
import { AiOutlineBank, AiOutlineFileText } from "react-icons/ai";
import { BsBox } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState, useEffect } from "react";
import routes from "../../routes/routes";
import logout from "../../helpers/logout";
import { Button } from "../components/ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Car, ChartColumnStacked, LockKeyhole } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
  isOpenedByClick?: boolean;
  setIsOpenedByClick?: (value: boolean) => void;
  bannerVisible?: boolean;
}

interface NavLink {
  name: string;
  icon: JSX.Element;
  link: string;
  permission?: string;
  route?: string;
}

interface ServiceLink {
  name: string;
  link: string;
  permission?: string;
  route?: string;
}

const ALL_NAV_LINKS: NavLink[] = [
  {
    name: "Dashboard",
    icon: <ChartColumnStacked size={20} />,
    link: routes.DASHBOARD,
    route: "/dashboard",
  },
  {
    name: "Usuários",
    icon: <BiUser size={20} />,
    link: routes.USERS,
    route: "/users",
  },
  {
    name: "Clientes",
    icon: <AiOutlineBank size={20} />,
    link: routes.CUSTOMERS,
    route: "/customers",
  },
  {
    name: "Transportes",
    icon: <Car size={20} />,
    link: routes.TRANSPORT,
    route: "/transport",
  },
  {
    name: "Permissões",
    icon: <LockKeyhole size={20} />,
    link: routes.PERMISSIONS,
    route: "/permissions",
  },
];

const ALL_SERVICE_ORDER_LINKS: ServiceLink[] = [
  {
    name: "PCP",
    link: routes.PCP,
    route: "/pcp",
  },
  {
    name: "Entregas do Dia",
    link: routes.DELIVERIES_OF_THE_DAY,
    route: "/deliveriesoftheday",
  },
  {
    name: "Histórico",
    link: routes.SERVICE_ORDER,
    route: "/serviceorder",
  },
];

const ALL_INVOICE_LINKS: ServiceLink[] = [
  {
    name: "Faturamento",
    link: routes.INVOICE_SERVICE_ORDER,
    route: "/invoiceserviceorder",
  },
  {
    name: "Faturadas",
    link: routes.INVOICED_SERVICE_ORDER,
    route: "/invoiced-serviceorder",
  },
  {
    name: "Ordem de Compra",
    link: routes.PURCHASE_ORDER,
    route: "/purchaseorder",
  },
  {
    name: "Notas Fiscais",
    link: routes.INVOICE,
    route: "/invoices",
  },
  {
    name: "Reposições",
    link: routes.REPLACEMENTS,
    route: "/replacements",
  },
];

const ALL_STORAGE_LINKS: ServiceLink[] = [
  {
    name: "Gravação",
    link: routes.RECORDING,
    route: "/storage/recording",
  },
];

export default function Sidebar({
  isOpen,
  onToggle,
  isOpenedByClick = false,
  setIsOpenedByClick,
  bannerVisible = false,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [serviceOrderOpen, setServiceOrderOpen] = useState(false);
  const [financialOpen, setFinancialOpen] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [openTimer, setOpenTimer] = useState<NodeJS.Timeout | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const isActiveDropdown = (links: ServiceLink[]) => {
    return links.some((link) => location.pathname === link.link);
  };

  const toggleServiceOrder = () => {
    if (isOpen) {
      setServiceOrderOpen(!serviceOrderOpen);
    }
  };

  const toggleFinancial = () => {
    if (isOpen) {
      setFinancialOpen(!financialOpen);
    }
  };

  const toggleStorage = () => {
    if (isOpen) {
      setStorageOpen(!storageOpen);
    }
  };

  const clearAllTimers = () => {
    if (openTimer) {
      clearTimeout(openTimer);
      setOpenTimer(null);
    }
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  };

  const handleNavigation = (link: string) => {
    setIsNavigating(true);

    clearAllTimers();

    navigate(link);

    setServiceOrderOpen(false);
    setFinancialOpen(false);

    if (isOpen && !isOpenedByClick && onToggle && setIsOpenedByClick) {
      onToggle();
    }

    // Aguarda um tempo antes de permitir hover novamente (especialmente importante para páginas pesadas)
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000); // 1 segundo de delay para páginas pesadas
  };

  const clearOpenTimer = () => {
    if (openTimer) {
      clearTimeout(openTimer);
      setOpenTimer(null);
    }
  };

  const clearHoverTimer = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  };

  const openSidebarByHover = () => {
    if (!isOpen && !isNavigating && onToggle && setIsOpenedByClick) {
      onToggle();
    }
  };

  const handleMouseEnter = () => {
    if (isNavigating) return;

    clearHoverTimer();

    if (!isOpen && !openTimer && onToggle && setIsOpenedByClick) {
      const timer = setTimeout(() => {
        openSidebarByHover();
        setOpenTimer(null);
      }, 500);
      setOpenTimer(timer);
    }
  };

  const handleMouseLeave = () => {
    if (isNavigating) return;

    clearOpenTimer();

    if (isOpen && !isOpenedByClick && onToggle) {
      const timer = setTimeout(() => {
        if (!isNavigating) {
          onToggle();
          setServiceOrderOpen(false);
          setFinancialOpen(false);
        }
      }, 350);
      setHoverTimer(timer);
    }
  };

  const handleIconHover = () => {
    if (isNavigating) return;

    clearHoverTimer();

    if (!isOpen && !openTimer && onToggle && setIsOpenedByClick) {
      const timer = setTimeout(() => {
        openSidebarByHover();
        setOpenTimer(null);
      }, 500); // Delay de 500ms para abrir
      setOpenTimer(timer);
    }
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  useEffect(() => {
    if (isNavigating) return;

    if (isOpen) {
      const currentPath = location.pathname;

      const isInServiceOrderRoute = ALL_SERVICE_ORDER_LINKS.some(
        (link) => link.link === currentPath,
      );
      if (isInServiceOrderRoute) {
        setServiceOrderOpen(true);
        setFinancialOpen(false);
        return;
      }

      const isInInvoiceRoute = ALL_INVOICE_LINKS.some(
        (link) => link.link === currentPath,
      );
      if (isInInvoiceRoute) {
        setFinancialOpen(true);
        setServiceOrderOpen(false);
        return;
      }

      setServiceOrderOpen(false);
      setFinancialOpen(false);
    } else {
      setServiceOrderOpen(false);
      setFinancialOpen(false);
    }
  }, [isOpen, location.pathname, isNavigating]);

  const topPosition = bannerVisible ? "top-24" : "top-16";
  const sidebarHeight = bannerVisible
    ? "calc(100vh - 6rem)"
    : "calc(100vh - 4rem)";

  return (
    <aside
      className={`h-screen bg-gray-900 overflow-x-hidden rounded-r-2xl text-white flex flex-col justify-between shadow-md transition-all duration-300 fixed left-0 ${topPosition} z-40 ${
        isOpen ? "w-48" : "w-16"
      }`}
      style={{ height: sidebarHeight }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-3 pt-6 overflow-y-auto overflow-x-hidden flex-1">
        <nav className="space-y-1">
          {ALL_NAV_LINKS.map(({ name, icon, link }) => {
            const isActive = location.pathname === link;
            return (
              <div key={name} className="relative">
                <Button
                  variant="ghost"
                  className={`w-full ${isOpen ? "justify-start px-3 pr-6" : "justify-center px-0"} h-12 rounded-full text-white hover:bg-[#f9a853]/20 transition-colors duration-200 relative group`}
                  onClick={() => handleNavigation(link)}
                  onMouseEnter={handleIconHover}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {icon}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f9a853] rounded-full"></div>
                      )}
                    </div>
                    {isOpen && (
                      <span className="text-sm font-medium">{name}</span>
                    )}
                  </div>
                  {isActive && isOpen && (
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#f9a853] rounded-l-full"></div>
                  )}
                </Button>
                {!isOpen && (
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                    {name}
                  </div>
                )}
              </div>
            );
          })}

          {ALL_SERVICE_ORDER_LINKS.length > 0 && (
            <div className="relative">
              <Button
                variant="ghost"
                className={`w-full ${isOpen ? "justify-start px-3 pr-6" : "justify-center px-0"} h-12 rounded-full text-white hover:bg-[#f9a853]/20 transition-colors duration-200 relative group`}
                onClick={toggleServiceOrder}
                onMouseEnter={handleIconHover}
              >
                {!isOpen ? (
                  <div className="relative">
                    <AiOutlineFileText size={20} />
                    {isActiveDropdown(ALL_SERVICE_ORDER_LINKS) && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f9a853] rounded-full"></div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <AiOutlineFileText size={20} />
                      {isActiveDropdown(ALL_SERVICE_ORDER_LINKS) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f9a853] rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium flex-1 text-left">
                      Produção
                    </span>
                    <MdOutlineKeyboardArrowDown
                      className={`transition-transform duration-200 ${serviceOrderOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                )}
                {isActiveDropdown(ALL_SERVICE_ORDER_LINKS) && isOpen && (
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#f9a853] rounded-l-full"></div>
                )}
              </Button>

              {!isOpen && (
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                  Produção
                </div>
              )}

              {isOpen && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${serviceOrderOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="ml-8 mt-1 space-y-1">
                    {ALL_SERVICE_ORDER_LINKS.map(({ name, link }) => {
                      const isActive = location.pathname === link;
                      return (
                        <Button
                          key={name}
                          variant="ghost"
                          className={`w-full justify-start px-3 py-2 h-10 text-sm rounded-full hover:bg-[#f9a853]/20 transition-colors duration-200 ${
                            isActive
                              ? "text-white font-medium"
                              : "text-gray-300"
                          }`}
                          onClick={() => handleNavigation(link)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {isActive ? (
                                <div className="w-2 h-2 bg-[#f9a853] rounded-full"></div>
                              ) : (
                                <div className="w-2 h-2 border border-gray-500 rounded-full"></div>
                              )}
                            </div>
                            {name}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {ALL_INVOICE_LINKS.length > 0 && (
            <div className="relative">
              <Button
                variant="ghost"
                className={`w-full ${isOpen ? "justify-start px-3 pr-6" : "justify-center px-0"} h-12 rounded-full text-white hover:bg-[#f9a853]/20 transition-colors duration-200 relative group`}
                onClick={toggleFinancial}
                onMouseEnter={handleIconHover}
              >
                {!isOpen ? (
                  <div className="relative">
                    <AiOutlineFileText size={20} />
                    {isActiveDropdown(ALL_INVOICE_LINKS) && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f9a853] rounded-full"></div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <AiOutlineFileText size={20} />
                      {isActiveDropdown(ALL_INVOICE_LINKS) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f9a853] rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium flex-1 text-left">
                      Financeiro
                    </span>
                    <MdOutlineKeyboardArrowDown
                      className={`transition-transform duration-200 ${financialOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                )}
                {isActiveDropdown(ALL_INVOICE_LINKS) && isOpen && (
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#f9a853] rounded-l-full"></div>
                )}
              </Button>

              {!isOpen && (
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                  Financeiro
                </div>
              )}

              {isOpen && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${financialOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="ml-8 mt-1 space-y-1">
                    {ALL_INVOICE_LINKS.map(({ name, link }) => {
                      const isActive = location.pathname === link;
                      return (
                        <Button
                          key={name}
                          variant="ghost"
                          className={`w-full justify-start px-3 py-2 h-10 text-sm rounded-full hover:bg-[#f9a853]/20 transition-colors duration-200 ${
                            isActive
                              ? "text-white font-medium"
                              : "text-gray-300"
                          }`}
                          onClick={() => handleNavigation(link)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {isActive ? (
                                <div className="w-2 h-2 bg-[#f9a853] rounded-full"></div>
                              ) : (
                                <div className="w-2 h-2 border border-gray-500 rounded-full"></div>
                              )}
                            </div>
                            {name}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {ALL_STORAGE_LINKS.length > 0 && (
            <div className="relative">
              <Button
                variant="ghost"
                className={`w-full ${isOpen ? "justify-start px-3 pr-6" : "justify-center px-0"} h-12 rounded-full text-white hover:bg-[#f9a853]/20 transition-colors duration-200 relative group`}
                onClick={toggleStorage}
                onMouseEnter={handleIconHover}
              >
                {!isOpen ? (
                  <div className="relative">
                    <BsBox size={20} />
                    {isActiveDropdown(ALL_STORAGE_LINKS) && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f9a853] rounded-full"></div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <BsBox size={20} />

                      {isActiveDropdown(ALL_STORAGE_LINKS) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f9a853] rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium flex-1 text-left">
                      Estoque
                    </span>
                    <MdOutlineKeyboardArrowDown
                      className={`transition-transform duration-200 ${storageOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                )}
                {isActiveDropdown(ALL_STORAGE_LINKS) && isOpen && (
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#f9a853] rounded-l-full"></div>
                )}
              </Button>

              {!isOpen && (
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                  Estoque
                </div>
              )}

              {isOpen && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${storageOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="ml-8 mt-1 space-y-1">
                    {ALL_STORAGE_LINKS.map(({ name, link }) => {
                      const isActive = location.pathname === link;
                      return (
                        <Button
                          key={name}
                          variant="ghost"
                          className={`w-full justify-start px-3 py-2 h-10 text-sm rounded-full hover:bg-[#f9a853]/20 transition-colors duration-200 ${
                            isActive
                              ? "text-white font-medium"
                              : "text-gray-300"
                          }`}
                          onClick={() => handleNavigation(link)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {isActive ? (
                                <div className="w-2 h-2 bg-[#f9a853] rounded-full"></div>
                              ) : (
                                <div className="w-2 h-2 border border-gray-500 rounded-full"></div>
                              )}
                            </div>
                            {name}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator className="bg-gray-700 my-4 h-px" />
        </nav>
      </div>

      <div className="mt-auto flex flex-col overflow-x-hidden">
        <div className="p-3 border-t border-gray-700">
          <Button
            variant="ghost"
            className={`w-full ${isOpen ? "justify-start px-3" : "justify-center px-0"} h-12 rounded-full text-red-400 hover:bg-red-500/20 transition-colors duration-200 relative group`}
            // onClick={() => logout(navigate)}
            onMouseEnter={handleIconHover}
          >
            <div className="flex items-center gap-4">
              <BiLogOut size={20} />
              {isOpen && <span className="text-sm font-medium">Sair</span>}
            </div>
            {!isOpen && (
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                Sair
              </div>
            )}
          </Button>
        </div>
        {isOpen && (
          <div className="py-2 px-4 border-t border-gray-700 text-center text-[11px] text-gray-400 select-none">
            © 2025 easyflow x.x.x
          </div>
        )}
      </div>
    </aside>
  );
}
