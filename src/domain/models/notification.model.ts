export type NotifType = 'info' | 'warning' | 'reward';

export interface NotificationModel {
  id?: string;                // ← Firestore docId
  userId: string;             // alumno / padre / teacher / admin
  title: string;
  body:  string;
  date:  Date;                // guardamos como timestamp
  type:  NotifType;
  read:  boolean;
}
