import { db } from '../config/firebaseAdmin';

/**
 * Métodos genéricos para CRUD en Firestore
 */
export class GenericFirebaseService {

  static async createDocument(collectionName: string, data: any) {
    const ref = await db.collection(collectionName).add({
      ...data,
      createdAt: new Date()
    });
    const snap = await ref.get();
    return { id: ref.id, ...snap.data() };
  }

  static async getDocumentById(collectionName: string, docId: string) {
    const docRef = await db.collection(collectionName).doc(docId).get();
    if (!docRef.exists) return null;
    return { id: docRef.id, ...docRef.data() };
  }

  static async updateDocument(collectionName: string, docId: string, data: any) {
    await db.collection(collectionName).doc(docId).update({
      ...data,
      updatedAt: new Date()
    });
    return this.getDocumentById(collectionName, docId);
  }

  static async deleteDocument(collectionName: string, docId: string) {
    await db.collection(collectionName).doc(docId).delete();
    return true;
  }

  // ... otros métodos (list, queries, etc.)
}
