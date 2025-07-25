import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  FC,
} from "react";
import { fetchUser, User } from "./api/PermissionsService";

interface PermissionsContextType {
  user: User | null;
  permissions: string[];
  allowedRoutes: string[];
  hasPermission: (permission: string) => boolean;
  hasRouteAccess: (route: string) => boolean;
  fetchUserData: () => Promise<void>;
  loading: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined,
);

export const PermissionsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [allowedRoutes, setAllowedRoutes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const userData = await fetchUser();
      setUser(userData);

      setPermissions(userData.group.permissions || []);

      const routes =
        userData.group.routePermissions?.map((rp) => rp.route) || [];
      setAllowedRoutes(routes);

      console.log("Usuário:", userData);
      console.log("Rotas permitidas:", routes);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      setPermissions([]);
      setAllowedRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.location.pathname === "/login") {
      setLoading(false);
      return;
    }
    fetchUserData();
  }, []);

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasRouteAccess = (route: string): boolean => {
    if (allowedRoutes.length === 0) return false;

    const normalizedRoute = route.split("?")[0].replace(/\/$/, "") || "/";

    if (allowedRoutes.includes(normalizedRoute)) return true;

    return allowedRoutes.some((allowedRoute) => {
      if (normalizedRoute.startsWith(allowedRoute + "/")) {
        return true;
      }
      return false;
    });
  };

  return (
    <PermissionsContext.Provider
      value={{
        user,
        permissions,
        allowedRoutes,
        hasPermission,
        hasRouteAccess,
        fetchUserData,
        loading,
      }}
    >
      {!loading && children}
    </PermissionsContext.Provider>
  );
};

export const usePermission = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error(
      "usePermission deve ser usado dentro de PermissionsProvider",
    );
  }
  return context;
};
