import { FirebaseService } from "./firebase.service";
import {
  CreateClassDTO,
  UpdateClassDTO,
} from "../domain/dtos/class.dto";

const COL = "classes";

export class ClassService {
  /* CREATE -------------------------------------------------- */
  static async create(dto: CreateClassDTO & { createdBy: string }) {
    const data = {
      ...dto,
      teacherIds: dto.teacherIds ?? [dto.createdBy],
      students: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return FirebaseService.createDoc(COL, data);
  }

  /* READ ---------------------------------------------------- */
  static getAll() {
    return FirebaseService.getCollection(COL);
  }

  static getById(id: string) {
    return FirebaseService.getDocById(COL, id);
  }

  /* UPDATE -------------------------------------------------- */
  static async update(id: string, dto: UpdateClassDTO) {
    dto.updatedAt = new Date();
    return FirebaseService.updateDoc(COL, id, dto);
  }

  /* DELETE -------------------------------------------------- */
  static delete(id: string) {
    return FirebaseService.deleteDoc(COL, id);
  }
}
