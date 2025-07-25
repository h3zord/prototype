import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNotifications } from "./hook/useNotifications";
import NotificationToastContent from "./NotificationToastContent";
import { useLocation } from "react-router-dom";

const CustomCloseButton = ({ closeToast }: { closeToast?: () => void }) => (
  <button
    onClick={closeToast}
    className="absolute top-2 right-3 text-gray-400 hover:text-gray-200 transition-colors duration-200"
    aria-label="Fechar"
  >
    &times;
  </button>
);

export const AdminNotificationToast = () => {
  const displayedNotificationIds = useRef(new Set<number>());
  const location = useLocation();
  const shouldFetch = location.pathname !== "/login";

  const { data } = useNotifications({
    enabled: shouldFetch,
  });

  useEffect(() => {
    if (!data) return;

    data.notifications.forEach((notification) => {
      if (!displayedNotificationIds.current.has(notification.id)) {
        displayedNotificationIds.current.add(notification.id);

        toast.info(<NotificationToastContent notification={notification} />, {
          toastId: notification.id,
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          className: `
            relative bg-gray-800 text-gray-100 font-medium 
            p-4 pr-10 rounded-md shadow-md border border-gray-700 
            text-sm
          `,
          closeButton: CustomCloseButton,
          icon: false,
        });
      }
    });
  }, [data]);

  return null;
};
