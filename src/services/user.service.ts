import { GenericFirebaseService } from './genericFirebase.service';
import { UserModel } from '../domain/models/user.model';
import { encryptData } from '../utils/encryption'; // Update the path to the correct location

export class UserService {

  static async createUser(email: string, password: string, role = 'student') {
    const encryptedPass = encryptData(password); 
    const userData: Partial<UserModel> = {
      email,
      password: encryptedPass,
      role
    };
    const doc = await GenericFirebaseService.createDocument('users', userData);
    return doc;
  }

  static async getUserById(userId: string) {
    return GenericFirebaseService.getDocumentById('users', userId);
  }

  // ... más métodos (updateUser, deleteUser, listUsers)
}
