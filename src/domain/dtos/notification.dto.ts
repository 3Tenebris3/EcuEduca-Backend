// src/domain/dtos/notification.dto.ts
export type NotificationType = "info" | "warning" | "reward";

export interface NotificationDTO {
  id:    string;            // doc id
  userId:string;            // receptor
  title: string;
  body:  string;
  date:  string;            // ISO
  type:  NotificationType;
  read:  boolean;
}

export interface CreateNotificationDTO {
  userId: string;
  title:  string;
  body:   string;
  type:   NotificationType;
}
