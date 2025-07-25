// hooks/useSidebar.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  toggleSidebar: () => void;
  getDynamicPaddingRight: () => string;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Provider do contexto
export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const getDynamicPaddingRight = () => {
    return isSidebarOpen ? "pr-52" : "pr-20";
  };

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        getDynamicPaddingRight,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// Hook customizado
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
