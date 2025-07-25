import { api } from "../../../../config/api";

export type Notification = {
  id: number;
  message: string;
  type?: string;
  operatorId?: number;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetNotificationsResponse = {
  notifications: Notification[];
};

export type ServiceOrderAlertsResponse = {
  alertsByOperator: {
    [operatorId: string]: {
      count: number;
      operatorName: string;
    };
  };
  notifications: Notification[];
};

export const markNotificationAsRead = async (
  notificationId: number
): Promise<{ notification: Notification; message: string }> => {
  const response = await api.patch(
    `/notification/${notificationId}/mark-as-read`
  );
  return response.data;
};

export const checkServiceOrderAlerts =
  async (): Promise<ServiceOrderAlertsResponse> => {
    const response = await api.get("/notification/check-service-order-alerts");
    return response.data;
  };
