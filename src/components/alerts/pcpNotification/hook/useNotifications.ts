import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  markNotificationAsRead,
  checkServiceOrderAlerts,
  ServiceOrderAlertsResponse,
} from "../services/notification.service";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["service-order-alerts"] });
    },
  });
};

export const useServiceOrderAlerts = (
  options?: Omit<
    UseQueryOptions<ServiceOrderAlertsResponse, unknown>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["service-order-alerts"],
    queryFn: checkServiceOrderAlerts,
    refetchInterval: 5 * 60 * 1000, // Verifica a cada 5 minutos
    ...options,
  });
};
