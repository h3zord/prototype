import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import ServiceOrderAlertContent from "./NotificationToastContent";
import { usePermission } from "../../../context/PermissionsContext";
import { useServiceOrderAlerts } from "./hook/useNotifications";

export const ServiceOrderMonitorToast = () => {
  const alertedNotificationIds = useRef(new Set<number>());
  const location = useLocation();
  const shouldMonitor = location.pathname !== "/login";
  const { user } = usePermission();

  const { data: alertsData, error } = useServiceOrderAlerts({
    enabled: shouldMonitor && !!user,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!alertsData || !shouldMonitor || !user) return;

    const userNotifications = alertsData.notifications;

    if (userNotifications && userNotifications.length > 0) {
      const newNotifications = userNotifications.filter(
        (notification) => !alertedNotificationIds.current.has(notification.id)
      );

      if (newNotifications.length > 0) {
        userNotifications.forEach((notification) => {
          alertedNotificationIds.current.add(notification.id);
        });

        const firstMessage = userNotifications[0].message;
        const operatorMatch = firstMessage.match(/Operador:\s*(.+)$/);
        const operatorName = operatorMatch
          ? operatorMatch[1]
          : user.firstName + " " + user.lastName;

        toast.warning(
          <ServiceOrderAlertContent
            operatorName={operatorName}
            alertCount={userNotifications.length}
            notifications={userNotifications}
            onDismiss={() => {
              toast.dismiss(`user-alerts-${user.id}`);
              userNotifications.forEach((notification) => {
                alertedNotificationIds.current.delete(notification.id);
              });
            }}
          />,
          {
            toastId: `user-alerts-${user.id}`,
            position: "top-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            closeButton: false,
            icon: false,
            className: `
            relative bg-gray-800 text-gray-100 font-medium 
            p-4 pr-10 rounded-md shadow-md border border-gray-700 
            text-sm
          `,
            style: {
              padding: 0,
              minHeight: "auto",
            },
          }
        );
      }
    }
  }, [alertsData, shouldMonitor, user]);

  useEffect(() => {
    return () => {
      alertedNotificationIds.current.clear();
    };
  }, [location.pathname]);

  useEffect(() => {
    if (error) {
      console.error("Erro ao verificar alertas de Service Order:", error);
    }
  }, [error]);

  return null;
};
