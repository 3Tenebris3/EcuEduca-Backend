import { FirebaseService } from "./firebase.service";
import {
  CreateUnitDTO,
  UpdateUnitDTO,
} from "../domain/dtos/unit.dto";

const COL = "classes";

export class UnitService {
  /* Helpers */
  private static unitCol(classId: string) {
    return `${COL}/${classId}/units`;
  }

  /* CREATE */
  static async create(classId: string, dto: CreateUnitDTO & { createdBy: string }) {
    const data = {
      ...dto,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return FirebaseService.createDoc(this.unitCol(classId), data);
  }

  /* READ */
  static getAll(classId: string) {
    return FirebaseService.getCollection(this.unitCol(classId));
  }

  static getById(classId: string, unitId: string) {
    return FirebaseService.getDocById(this.unitCol(classId), unitId);
  }

  /* UPDATE */
  static update(classId: string, unitId: string, dto: UpdateUnitDTO) {
    dto.updatedAt = new Date();
    return FirebaseService.updateDoc(this.unitCol(classId), unitId, dto);
  }

  /* DELETE */
  static delete(classId: string, unitId: string) {
    return FirebaseService.deleteDoc(this.unitCol(classId), unitId);
  }
}
