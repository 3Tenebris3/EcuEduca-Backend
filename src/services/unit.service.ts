import { CreateUnitDTO, UpdateUnitDTO } from '../domain/dtos/unit.dto';
import { FirebaseService } from './firebase.service';

export class UnitService {
  /** ruta helper */
  private static path(classId: string) {
    return `classes/${classId}/units`;
  }

  static create(classId: string, dto: CreateUnitDTO & { createdBy: string }) {
    const data = {
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    return FirebaseService.createDoc(this.path(classId), data);
  }

  static getAll(classId: string) {
    return FirebaseService.getCollection(this.path(classId));
  }

  static getById(classId: string, unitId: string) {
    return FirebaseService.getDocById(this.path(classId), unitId);
  }

  static update(classId: string, unitId: string, dto: UpdateUnitDTO) {
    dto.updatedAt = new Date();
    return FirebaseService.updateDoc(this.path(classId), unitId, dto);
  }

  static delete(classId: string, unitId: string) {
    return FirebaseService.deleteDoc(this.path(classId), unitId);
  }
}
