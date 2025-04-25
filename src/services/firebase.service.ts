import { db } from '../config/firebaseAdmin';

/**
 * Métodos genéricos para interactuar con Firestore (CRUD).
 */
export class FirebaseService {
  static async createDoc(collectionName: string, data: any): Promise<any> {
    // Inserta los datos y añade la propiedad createdAt
    const ref = await db.collection(collectionName).add({
      ...data,
      createdAt: new Date()
    });
    // Retornamos explícitamente el objeto combinado:
    return { id: ref.id, ...data, createdAt: new Date() };
  }

  static async getDocById(collectionName: string, docId: string): Promise<any> {
    const doc = await db.collection(collectionName).doc(docId).get();
    if (!doc.exists) return null;
    // Retornamos el objeto combinado con el id
    return { id: doc.id, ...doc.data() };
  }

  static async updateDoc(collectionName: string, docId: string, data: any): Promise<any> {
    await db.collection(collectionName).doc(docId).update({
      ...data,
      updatedAt: new Date()
    });
    return this.getDocById(collectionName, docId);
  }

  static async deleteDoc(collectionName: string, docId: string): Promise<boolean> {
    await db.collection(collectionName).doc(docId).delete();
    return true;
  }

  static async findDocsByField(collectionName: string, field: string, value: any): Promise<any[]> {
    const snapshot = await db.collection(collectionName).where(field, '==', value).get();
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getAllDocs(collectionName: string): Promise<any[]> {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
}
