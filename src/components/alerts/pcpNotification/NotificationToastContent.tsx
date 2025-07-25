import React from "react";
import { useMarkNotificationAsRead } from "./hook/useNotifications";

type ServiceOrderAlertContentProps = {
  operatorName: string;
  alertCount: number;
  notifications: Array<{
    id: number;
    message: string;
    createdAt: string;
    type?: string;
    read: boolean;
  }>;
  onDismiss: () => void;
};

const ServiceOrderAlertContent: React.FC<ServiceOrderAlertContentProps> = ({
  notifications,
  onDismiss,
}) => {
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleDismiss = async () => {
    try {
      await Promise.all(
        notifications.map((notification) =>
          markAsReadMutation.mutateAsync(notification.id)
        )
      );
      onDismiss();
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
    }
  };

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg">
      <div className="p-3">
        <div className="space-y-1">
          {notifications.map((notification) => (
            <div key={notification.id}>
              <p className="text-sm text-amber-800 font-medium">
                {notification.message}
              </p>
              <p className="text-xs text-amber-600">
                {new Date(notification.createdAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-2">
          <button
            onClick={handleDismiss}
            disabled={markAsReadMutation.isPending}
            className="
              text-xs text-amber-700 hover:text-amber-900
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              font-medium
            "
          >
            {markAsReadMutation.isPending ? "..." : "Descartar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderAlertContent;
