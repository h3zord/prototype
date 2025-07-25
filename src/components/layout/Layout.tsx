import Sidebar from "./Sidebar";
import DefaultPageContainer from "./DefaultPageContainer";
import { SidebarProvider, useSidebar } from "../../hooks/useSidebar";
import Header from "./Header";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { AlertTriangle, X, Code } from "lucide-react";

declare global {
  interface Window {
    closeSidebarMenus?: () => void;
  }
}

// Componente para o banner de ambiente
const EnvironmentBanner = ({ onClose }: { onClose: () => void }) => {
  const environment = import.meta.env.VITE_ENVIRONMENT;

  // Só mostra se for development ou preview
  if (
    !environment ||
    (environment !== "development" && environment !== "preview")
  ) {
    return null;
  }

  const getEnvironmentConfig = () => {
    if (environment === "development") {
      return {
        label: "AMBIENTE DE DESENVOLVIMENTO",
        bgColor: "bg-orange-500",
        textColor: "text-white",
        icon: Code,
      };
    } else {
      return {
        label: "AMBIENTE DE PREVIEW",
        bgColor: "bg-blue-500",
        textColor: "text-white",
        icon: AlertTriangle,
      };
    }
  };

  const config = getEnvironmentConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`${config.bgColor} ${config.textColor} h-8 w-full flex items-center justify-center text-xs font-medium fixed top-0 left-0 right-0 z-50`}
    >
      <div className="flex items-center gap-2">
        <IconComponent size={14} />
        <span>{config.label}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-6 w-6 p-0 hover:bg-white/20 rounded-full absolute right-4"
      >
        <X size={12} />
      </Button>
    </div>
  );
};

const LayoutContent = ({ children }: { children: JSX.Element }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isOpenedByClick, setIsOpenedByClick] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const handleToggleSidebar = () => {
    toggleSidebar();
    setIsOpenedByClick(true);
  };

  const environment = import.meta.env.VITE_ENVIRONMENT;
  const shouldShowBanner =
    showBanner &&
    environment &&
    (environment === "development" || environment === "preview");
  const topOffset = shouldShowBanner ? "pt-24" : "pt-16";

  return (
    <div className="flex min-h-screen overflow-hidden">
      {shouldShowBanner && (
        <EnvironmentBanner onClose={() => setShowBanner(false)} />
      )}

      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={handleToggleSidebar}
        bannerVisible={shouldShowBanner}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        isOpenedByClick={isOpenedByClick}
        setIsOpenedByClick={setIsOpenedByClick}
        bannerVisible={shouldShowBanner}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${topOffset} ${
          isSidebarOpen ? "ml-48" : "ml-16"
        }`}
      >
        <main className="flex-1 overflow-auto">
          <DefaultPageContainer>{children}</DefaultPageContainer>
        </main>
      </div>
    </div>
  );
};

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

export default Layout;
