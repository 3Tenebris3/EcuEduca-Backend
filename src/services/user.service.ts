import bcrypt from "bcryptjs";
import { FirebaseService } from "./firebase.service";
import {
  CreateUserDTO,
  UpdateUserDTO,
  AvatarKey,
} from "../domain/dtos/user.dto";
import { UserModel } from "../domain/models/user.model";

const COL = "users";
const SALT = 10;
const now = () => new Date();

export class UserService {
  /* CREATE */
  static async createUser(dto: CreateUserDTO): Promise<UserModel> {
    const hashed = await bcrypt.hash(dto.password, SALT);
    const data: Omit<UserModel, "id"> = {
      email: dto.email,
      password: hashed,
      displayName: dto.displayName,
      phone: dto.phone ?? "",
      avatar: dto.avatar ?? ("avatar1.png" as AvatarKey),
      roles: [dto.role ?? "student"],
      classes: [],
      teacherId: dto.teacherId ?? "",
      createdAt: now(),
      updatedAt: now(),
    };
    return FirebaseService.createDoc<UserModel>(COL, data);
  }

  /* READ */
  static getUserById(id: string) {
    return FirebaseService.getDocById<UserModel>(COL, id);
  }
  static getAllUsers() {
    return FirebaseService.getCollection<UserModel>(COL);
  }
  static async findByEmail(email: string) {
    const r = await FirebaseService.findDocsByField<UserModel>(
      COL,
      "email",
      email,
      "=="
    );
    return r[0] ?? null;
  }

  /* UPDATE */
  static updateUser(id: string, dto: UpdateUserDTO) {
    if (dto.password) delete dto.password;
    dto.updatedAt = now();
    return FirebaseService.updateDoc<UserModel>(COL, id, dto);
  }

  /* DELETE */
  static deleteUser(id: string) {
    return FirebaseService.deleteDoc(COL, id);
  }

  /* AVATAR */
  static setAvatar(id: string, avatar: AvatarKey) {
    return FirebaseService.updateDoc<UserModel>(COL, id, {
      avatar,
      updatedAt: now(),
    });
  }

  /* PASSWORD */
  static async changePassword(id: string, oldPwd: string, newPwd: string) {
    const user = await this.getUserById(id);
    if (!user) return false;
    const ok = await bcrypt.compare(oldPwd, user.password);
    if (!ok) return false;
    const hash = await bcrypt.hash(newPwd, SALT);
    await FirebaseService.updateDoc(COL, id, { password: hash });
    return true;
  }

  /* RELACIONES */
  static getTeacherOfStudent(studentId: string) {
    return this.getUserById(studentId).then((st) =>
      st?.teacherId ? this.getUserById(st.teacherId) : null
    );
  }
  static getStudentsOfTeacher(teacherId: string) {
    return FirebaseService.findDocsByField<UserModel>(
      COL,
      "teacherId",
      teacherId,
      "=="
    );
  }
}
