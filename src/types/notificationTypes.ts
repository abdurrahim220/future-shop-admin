export interface INotification {
  _id: string;
  type: string;
  referenceId: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateNotificationPayload = Partial<INotification>;
export type UpdateNotificationPayload = Partial<INotification>;
