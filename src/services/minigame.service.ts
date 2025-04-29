import { CreateMinigameDTO, UpdateMinigameDTO } from '../domain/dtos/minigame.dto';
import { FirebaseService } from './firebase.service';
const COL = 'minigames';

export class MinigameService {
  static create(dto: CreateMinigameDTO & { createdBy: string }) {
    const data = {
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive:  true
    };
    return FirebaseService.createDoc(COL, data);
  }

  static getAll()               { return FirebaseService.getCollection(COL); }
  static getById(id: string)    { return FirebaseService.getDocById(COL, id); }

  static update(id: string, dto: UpdateMinigameDTO) {
    dto.updatedAt = new Date();
    return FirebaseService.updateDoc(COL, id, dto);
  }

  static delete(id: string)     { return FirebaseService.deleteDoc(COL, id); }
}
