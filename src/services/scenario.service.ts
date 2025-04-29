import { CreatePointDTO, CreateScenarioDTO, UpdatePointDTO, UpdateScenarioDTO } from '../domain/dtos/scenario.dto';
import { FirebaseService } from './firebase.service';
const COL = 'scenarios';

export class ScenarioService {
  /* ---------- escenarios ---------- */
  static create(dto: CreateScenarioDTO & { createdBy: string }) {
    const data = {
      ...dto,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return FirebaseService.createDoc(COL, data);
  }
  static getAll()            { return FirebaseService.getCollection(COL); }
  static getById(id: string) { return FirebaseService.getDocById(COL, id); }
  static update(id: string, dto: UpdateScenarioDTO) {
    dto.updatedAt = new Date();
    return FirebaseService.updateDoc(COL, id, dto);
  }
  static delete(id: string)  { return FirebaseService.deleteDoc(COL, id); }

  /* ---------- puntos de interés ---------- */
  private static pointsPath(sId: string) { return `${COL}/${sId}/points`; }

  static createPoint(sId: string, dto: CreatePointDTO) {
    dto.createdAt = new Date();
    return FirebaseService.createDoc(this.pointsPath(sId), dto);
  }
  static getPoints(sId: string) {
    return FirebaseService.getCollection(this.pointsPath(sId));
  }
  static updatePoint(sId: string, pId: string, dto: UpdatePointDTO) {
    return FirebaseService.updateDoc(this.pointsPath(sId), pId, dto);
  }
  static deletePoint(sId: string, pId: string) {
    return FirebaseService.deleteDoc(this.pointsPath(sId), pId);
  }
}
