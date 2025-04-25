import { FirebaseService } from "./firebase.service";
import { UserModel } from "../domain/models/user.model";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Servicio que maneja las operaciones CRUD sobre la colección "users" en Firestore.
 * Se encarga de crear, buscar, actualizar y eliminar usuarios en la base de datos.
 */
export class UserService {
  private static collection = "users";

  /**
   * Crea un usuario en Firestore, hasheando la contraseña antes de almacenarla.
   *
   * @param email - Correo electrónico del usuario.
   * @param password - Contraseña en texto plano (será hasheada).
   * @param displayName - Nombre a mostrar para el usuario.
   * @param role - Rol asignado al usuario; por defecto es 'student'.
   * @returns Un objeto que representa el usuario creado, conforme a la interfaz UserModel.
   */
  static async createUser(
    email: string,
    password: string,
    displayName: string,
    role: string = "admin"
  ): Promise<UserModel> {
    // Hasheamos la contraseña
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const data: Partial<UserModel> = {
      email,
      displayName,
      password: hashedPassword, // Almacena la contraseña hasheada
      roles: [role],
      classes: [],
      createdAt: new Date(),
    };

    // Se utiliza FirebaseService para crear el documento en Firestore.
    const newDoc = await FirebaseService.createDoc(this.collection, data);
    return newDoc;
  }

  /**
   * Obtiene un usuario de Firestore por su ID.
   *
   * @param userId - Identificador (ID del documento) del usuario.
   * @returns El objeto UserModel si se encuentra; de lo contrario, retorna null.
   */
  static async getUserById(userId: string): Promise<UserModel | null> {
    return FirebaseService.getDocById(this.collection, userId);
  }

  /**
   * Busca un usuario por su correo electrónico.
   *
   * @param email - Correo electrónico a buscar.
   * @returns El primer objeto UserModel encontrado o null si no se encuentra ningún usuario.
   */
  static async findUserByEmail(email: string): Promise<UserModel | null> {
    const results = await FirebaseService.findDocsByField(
      this.collection,
      "email",
      email
    );
    return results[0] || null;
  }

  /**
   * Actualiza los datos de un usuario en Firestore.
   *
   * @param userId - Identificador del usuario a actualizar.
   * @param updates - Objeto con las propiedades a modificar (parcialmente acorde a UserModel).
   * @returns El objeto UserModel actualizado o null si el usuario no existe.
   */
  static async updateUser(
    userId: string,
    updates: Partial<UserModel>
  ): Promise<UserModel | null> {
    return FirebaseService.updateDoc(this.collection, userId, updates);
  }

  /**
   * Elimina un usuario de Firestore por su ID.
   *
   * @param userId - Identificador del usuario a eliminar.
   * @returns true si se eliminó correctamente, false en caso contrario.
   */
  static async deleteUser(userId: string): Promise<boolean> {
    return FirebaseService.deleteDoc(this.collection, userId);
  }

  /**
   * Lista todos los usuarios en Firestore.
   * @returns Un arreglo de usuarios.
   */
  static async getAllUsers(): Promise<UserModel[]> {
    const users = await FirebaseService.getAllDocs(this.collection);
    return users;
  }
}
