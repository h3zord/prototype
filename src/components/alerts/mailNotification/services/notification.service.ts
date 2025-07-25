import { api } from "../../../../config/api";

export type Notification = {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetNotificationsResponse = {
  notifications: Notification[];
};

export const getNotifications = async (): Promise<GetNotificationsResponse> => {
  const response = await api.get("/notification");
  return response.data;
};

export const markNotificationAsRead = async (
  notificationId: number,
): Promise<{ notification: Notification; message: string }> => {
  const response = await api.patch(
    `/notification/${notificationId}/mark-as-read`,
  );
  return response.data;
};
