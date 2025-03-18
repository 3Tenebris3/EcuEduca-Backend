import { db } from '../config/firebaseAdmin';

export class AuthService {
  static async login(email: string, password: string) {
    // 1. Verificar si el usuario existe en Firestore
    // 2. Comparar password (hash, etc.)
    // 3. Si todo OK, crear token y retornarlo.
    // (Este es un ejemplo simplificado)

    // Consulta a Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
      throw new Error('User not found');
    }

    // Ejemplo sin hashing
    const doc = snapshot.docs[0];
    const userData = doc.data();
    if (userData.password !== password) {
      throw new Error('Invalid credentials');
    }

    
  }

  static async register(email: string, password: string, role: any) {
    // Ejemplo: crear un documento en la colección users
    const usersRef = db.collection('users');
    const newUserRef = await usersRef.add({
      email,
      password, // en un caso real, encriptar
      role: 'student'
    });

    // Retorna el usuario creado
    return { id: newUserRef.id, email };
  }
}
