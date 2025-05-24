// src/services/notification.service.ts
import { db } from "../config/firebaseAdmin";
import {
  NotificationDTO,
  CreateNotificationDTO,
} from "../domain/dtos/notification.dto";

const COLL = db.collection("notifications");

export async function listByUser(userId: string): Promise<NotificationDTO[]> {
  const snap = await COLL
    .where("userId", "==", userId)
    .orderBy("date", "desc")
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function create(dto: CreateNotificationDTO) {
  const doc = COLL.doc();
  await doc.set({
    ...dto,
    date: new Date().toISOString(),
    read: false,
  });
  return { id: doc.id };
}

export async function remove(userId: string, id: string) {
  const ref = COLL.doc(id);
  const doc = await ref.get();
  if (!doc.exists || doc.data()!.userId !== userId) throw new Error("forbidden");
  await ref.delete();
}
