import { db } from "../config/firebaseAdmin";
import {
  FieldValue,
  CollectionReference,
  Query,
} from "firebase-admin/firestore";

export class FirebaseService {
  /* util directo */
  static get FieldValue() {
    return FieldValue;
  }

  /* ---------- helpers ---------- */
  static collectionRef(path: string): FirebaseFirestore.Query {
  return db.collection(path);
}

  /* ---------- CRUD genérico con tipado ---------- */
  static async createDoc<T>(
    collection: string,
    data: Omit<T, "id">
  ): Promise<T> {
    const now = new Date();
    const ref = await db.collection(collection).add({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return { id: ref.id, ...data, createdAt: now, updatedAt: now } as T;
  }

  static async getDocById<T>(collection: string, id: string): Promise<T | null> {
    const snap = await db.collection(collection).doc(id).get();
    return snap.exists ? ({ id: snap.id, ...snap.data() } as T) : null;
  }

  static async updateDoc<T>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    const now = new Date();
    await db.collection(collection).doc(id).update({ ...data, updatedAt: now });
    const snap = await db.collection(collection).doc(id).get();
    return { id: snap.id, ...snap.data() } as T;
  }

  static deleteDoc(collection: string, id: string) {
    return db.collection(collection).doc(id).delete();
  }

  static async findDocsByField<T>(
    collection: string,
    field: string,
    val: any,
    op: FirebaseFirestore.WhereFilterOp = "=="
  ): Promise<T[]> {
    const snap = await db.collection(collection).where(field, op, val).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  }

  static async getCollection<T>(path: string): Promise<T[]> {
    const snap = await db.collection(path).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  }
}
