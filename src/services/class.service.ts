import { CreateClassDTO, UpdateClassDTO } from '../domain/dtos/class.dto';
import { FirebaseService } from './firebase.service';

const COL = 'classes';

export class ClassService {
  /* ---------- helpers ---------- */
  private static now() { return new Date(); }

  /* ---------- CRUD ---------- */
  static create(dto: CreateClassDTO & { createdBy: string }) {
    const data = {
      ...dto,
      students: [],
      createdAt: this.now(),
      updatedAt: this.now()
    };
    return FirebaseService.createDoc(COL, data);
  }

  static getAll() {
    return FirebaseService.getCollection(COL);
  }

  static getById(id: string) {
    return FirebaseService.getDocById(COL, id);
  }

  static update(id: string, dto: UpdateClassDTO) {
    dto.updatedAt = this.now();
    return FirebaseService.updateDoc(COL, id, dto);
  }

  static delete(id: string) {
    return FirebaseService.deleteDoc(COL, id);
  }

  /* ---------- asignaciones ---------- */
  static async addStudent(classId: string, studentId: string) {
    await FirebaseService.updateDoc(COL, classId, {
      students: FirebaseService.FieldValue.arrayUnion(studentId)
    });
    await FirebaseService.updateDoc('users', studentId, {
      classes: FirebaseService.FieldValue.arrayUnion(classId)
    });
  }

  static async removeStudent(classId: string, studentId: string) {
    await FirebaseService.updateDoc(COL, classId, {
      students: FirebaseService.FieldValue.arrayRemove(studentId)
    });
    await FirebaseService.updateDoc('users', studentId, {
      classes: FirebaseService.FieldValue.arrayRemove(classId)
    });
  }

  static async addTeacher(classId: string, teacherId: string) {
    await FirebaseService.updateDoc(COL, classId, {
      teacherIds: FirebaseService.FieldValue.arrayUnion(teacherId)
    });
  }

  static async removeTeacher(classId: string, teacherId: string) {
    await FirebaseService.updateDoc(COL, classId, {
      teacherIds: FirebaseService.FieldValue.arrayRemove(teacherId)
    });
  }
}
