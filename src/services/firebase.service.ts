import { db } from "../config/firebaseAdmin";
import {
  FieldValue,
} from "firebase-admin/firestore";

export type WithId<T = Record<string, unknown>> = T & { id: string };

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
  static async createDoc<T = any>(
    collection: string,
    data: Omit<T, "id">
  ): Promise<WithId<T>> {
    const ref = await db.collection(collection).add(data);
    return { id: ref.id, ...(data as T) };
  }

  static async getDocById<T = any>(
    collection: string,
    id: string
  ): Promise<WithId<T> | null> {
    const snap = await db.collection(collection).doc(id).get();
    return snap.exists ? ({ id: snap.id, ...snap.data() } as WithId<T>) : null;
  }

  static async updateDoc<T = any>(
    collection: string,
    id: string,
    data: Partial<Omit<T,"id">>
  ): Promise<WithId<T>> {
    await db.collection(collection).doc(id).update(data);
    const snap = await db.collection(collection).doc(id).get();
    return { id:snap.id, ...snap.data() } as WithId<T>;
  }

  static deleteDoc(collection:string,id:string){
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

  static async getCollection<T = any>(
    collection: string
  ): Promise<WithId<T>[]> {
    const snap = await db.collection(collection).get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<T>));
  }
}
