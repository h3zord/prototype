import { useNavigate, useLocation } from "react-router-dom";
import flexograv from "../../assets/images/logo_flexograv_branco.svg";
import routes from "../../routes/routes";
import { Button } from "../components/ui/button";
import { Logs } from "lucide-react";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  bannerVisible?: boolean;
}

const routeTitles: { [key: string]: string } = {
  "/users": "Usuários",
  "/customers": "Clientes",
  "/transport": "Transporte",
  "/permissions": "Permissões",
  "/pcp": "PCP",
  "/deliveriesoftheday": "Entregas do Dia",
  "/serviceorder": "Histórico de Ordens de Serviço",
  "/invoiced-serviceorder": "Faturadas",
  "/invoiceserviceorder": "Faturamento",
  "/purchaseorder": "Ordens de Compra",
  "/invoices": "Notas Fiscais",
  "/replacements": "Reposições",
};

const getPageTitle = (pathname: string): string | null => {
  if (routeTitles[pathname]) {
    return routeTitles[pathname];
  }

  const matchedRoute = Object.keys(routeTitles).find(
    (route) => pathname.startsWith(route) && route !== "/",
  );

  return matchedRoute ? routeTitles[matchedRoute] : null;
};

export default function Header({
  toggleSidebar,
  bannerVisible = false,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header
      className={`h-16 text-white flex items-center fixed ${bannerVisible ? "top-8" : "top-0"} left-0 right-0 z-40`}
    >
      <div className="flex items-center gap-8 px-4 w-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full h-8 w-8 flex-shrink-0"
        >
          <Logs size={8} className="text-white" />
        </Button>

        <div className="flex items-center">
          <img
            src={flexograv}
            alt="Logo"
            width={100}
            height={100}
            className="w-28 cursor-pointer"
            onClick={() => navigate(routes.HOME)}
          />

          {pageTitle && (
            <>
              <div className="h-8 w-px bg-gray-600/50 ml-[1rem] mr-6"></div>

              <div className="flex items-end gap-2">
                <h1 className="text-sm font-semibold text-white tracking-wide">
                  {pageTitle}
                </h1>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
