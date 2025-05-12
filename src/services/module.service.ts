import { FirebaseService } from "./firebase.service";
import {
  CreateModuleDTO,
  UpdateModuleDTO,
} from "../domain/dtos/module.dto";

const COL = "classes";

export class ModuleService {
  private static col(classId: string, unitId: string) {
    return `${COL}/${classId}/units/${unitId}/modules`;
  }

  static async create(
    classId: string,
    unitId: string,
    dto: CreateModuleDTO & { createdBy: string }
  ) {
    const data = {
      ...dto,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return FirebaseService.createDoc(this.col(classId, unitId), data);
  }

  static getAll(classId: string, unitId: string) {
    return FirebaseService.getCollection(this.col(classId, unitId));
  }

  static getById(classId: string, unitId: string, moduleId: string) {
    return FirebaseService.getDocById(this.col(classId, unitId), moduleId);
  }

  static update(
    classId: string,
    unitId: string,
    moduleId: string,
    dto: UpdateModuleDTO
  ) {
    dto.updatedAt = new Date();
    return FirebaseService.updateDoc(this.col(classId, unitId), moduleId, dto);
  }

  static delete(classId: string, unitId: string, moduleId: string) {
    return FirebaseService.deleteDoc(this.col(classId, unitId), moduleId);
  }
}
