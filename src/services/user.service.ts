import { FirebaseService } from "./firebase.service";
import { UserModel } from "../domain/models/user.model";
import bcrypt from "bcryptjs";
import { CreateUserDTO, UpdateUserDTO } from "../domain/dtos/user.dto";

const COL = "users";
const SALT_ROUNDS = 10;

export class UserService {
  /* -------- create -------- */
  static async createUser(dto: CreateUserDTO): Promise<UserModel> {
    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const data: Partial<UserModel> = {
      email: dto.email,
      displayName: dto.displayName,
      password: hashed,
      roles: [dto.role ?? "student"],
      classes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return FirebaseService.createDoc(COL, data);
  }

  /* -------- read -------- */
  static getUserById(id: string) {
    return FirebaseService.getDocById(COL, id);
  }
  static findUserByEmail(email: string) {
    return FirebaseService.findDocsByField(COL, "email", email).then(
      (r) => r[0] || null
    );
  }
  static getAllUsers() {
    return FirebaseService.getCollection(COL);
  }

  /* -------- update -------- */
  static updateUser(id: string, dto: UpdateUserDTO) {
    dto.updatedAt = new Date();
    if (dto.password) delete dto.password; // no permitir cambio aquí
    return FirebaseService.updateDoc(COL, id, dto);
  }

  /* -------- delete -------- */
  static deleteUser(id: string) {
    return FirebaseService.deleteDoc(COL, id);
  }
}
