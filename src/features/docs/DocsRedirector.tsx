import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { usePermission } from "../../context/PermissionsRouterContext";

const DocsRedirector = () => {
  const { hasRouteAccess, loading, allowedRoutes } = usePermission();

  useEffect(() => {
    if (!loading && hasRouteAccess("/docs")) {
      window.location.replace(`${import.meta.env.VITE_API_URL}/docs`);
    }
  }, [loading, hasRouteAccess]);

  if (loading) {
    return null; // Aguarda o carregamento das permissões
  }

  if (!hasRouteAccess("/docs")) {
    // Se não tem acesso, redireciona para a primeira rota permitida
    const redirectTo = allowedRoutes.length > 0 ? allowedRoutes[0] : "/login";
    return <Navigate to={redirectTo} replace />;
  }

  // Enquanto o useEffect não redireciona, pode mostrar um loader ou nada
  return null;
};

export default DocsRedirector;