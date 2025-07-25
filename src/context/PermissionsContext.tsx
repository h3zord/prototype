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
  hasPermission: (permission: string) => boolean;
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
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const userData = await fetchUser();
      setUser(userData);
      setPermissions(userData.group.permissions);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("permissions", permissions);

  useEffect(() => {
    fetchUserData();
  }, []);

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  return (
    <PermissionsContext.Provider
      value={{ user, permissions, hasPermission, fetchUserData, loading }}
    >
      {!loading && children}
    </PermissionsContext.Provider>
  );
};

// Hook para usar o contexto de permissões
// eslint-disable-next-line react-refresh/only-export-components
export const usePermission = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error(
      "usePermission deve ser usado dentro de PermissionsProvider",
    );
  }
  return context;
};
