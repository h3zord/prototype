import React from "react";
import { toast } from "react-toastify";
import { Notification } from "../mailNotification/services/notification.service";
import { useMarkNotificationAsRead } from "./hook/useNotifications";

type NotificationToastContentProps = {
  notification: Notification;
};

const NotificationToastContent: React.FC<NotificationToastContentProps> = ({
  notification,
}) => {
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const handleDiscard = () => {
    markAsRead(notification.id, {
      onSuccess: () => {
        toast.dismiss(notification.id);
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="leading-tight">{notification.message}</p>
      <div className="flex justify-end">
        <button
          onClick={handleDiscard}
          className="
            bg-gray-700 hover:bg-gray-600 text-white 
            rounded-md py-1 px-3 text-sm
          "
        >
          Descartar
        </button>
      </div>
    </div>
  );
};

export default NotificationToastContent;
