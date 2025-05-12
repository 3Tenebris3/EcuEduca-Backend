import { db } from '../config/firebaseAdmin';
import { NotificationModel } from '../domain/models/notification.model';

const COL = 'notifications';

export class NotificationService {
  /** lista (paginación mínima: -> startAfter / limit si lo necesitas) */
  static async getAll(userId: string): Promise<NotificationModel[]> {
    const snap = await db
      .collection(COL)
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as NotificationModel));
  }

  static async getById(id: string): Promise<NotificationModel | null> {
    const doc = await db.collection(COL).doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as NotificationModel) : null;
  }

  static async create(data: NotificationModel): Promise<NotificationModel> {
    const ref = await db.collection(COL).add({ ...data, read: false });
    const saved = await ref.get();
    return { id: ref.id, ...saved.data() } as NotificationModel;
  }

  /** marca como leída */
  static async markRead(id: string): Promise<void> {
    await db.collection(COL).doc(id).update({ read: true });
  }

  static async delete(id: string): Promise<void> {
    await db.collection(COL).doc(id).delete();
  }
}
