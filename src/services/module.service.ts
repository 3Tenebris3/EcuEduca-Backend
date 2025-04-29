import { CreateModuleDTO, UpdateModuleDTO } from '../domain/dtos/module.dto';
import { FirebaseService } from './firebase.service';

export class ModuleService {
  private static path(c: string, u: string) {
    return `classes/${c}/units/${u}/modules`;
  }

  static create(c: string, u: string, dto: CreateModuleDTO & { createdBy: string }) {
    const data = {
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive:  true
    };
    return FirebaseService.createDoc(this.path(c, u), data);
  }

  static getAll(c: string, u: string) {
    return FirebaseService.getCollection(this.path(c, u));
  }

  static getById(c: string, u: string, m: string) {
    return FirebaseService.getDocById(this.path(c, u), m);
  }

  static update(c: string, u: string, m: string, dto: UpdateModuleDTO) {
    dto.updatedAt = new Date();
    return FirebaseService.updateDoc(this.path(c, u), m, dto);
  }

  static delete(c: string, u: string, m: string) {
    return FirebaseService.deleteDoc(this.path(c, u), m);
  }
}
