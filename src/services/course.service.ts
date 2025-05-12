import { FirebaseService } from "./firebase.service";
import {
  CreateCourseDTO,
  UpdateCourseDTO,
} from "../domain/dtos/course.dto";

const COL = "courses";

export class CourseService {
  /* helpers */
  private static now() {
    return new Date();
  }

  /* ------------ CRUD ------------ */
  static async create(dto: CreateCourseDTO & { createdBy: string }) {
    const data = {
      ...dto,
      teacherIds: dto.teacherIds ?? [dto.createdBy],
      isActive: true,
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    return FirebaseService.createDoc(COL, data);
  }

  static getAllByTeacher(tid: string) {
    return FirebaseService.findDocsByField(COL, "teacherIds", tid, "array-contains");
  }

  static getById(id: string) {
    return FirebaseService.getDocById(COL, id);
  }

  static update(id: string, dto: UpdateCourseDTO) {
    dto.updatedAt = this.now();
    return FirebaseService.updateDoc(COL, id, dto);
  }

  static delete(id: string) {
    return FirebaseService.deleteDoc(COL, id);
  }

  /* ---------- asignar profesores ---------- */
  static addTeacher(courseId: string, teacherId: string) {
    return FirebaseService.updateDoc(COL, courseId, {
      teacherIds: FirebaseService.FieldValue.arrayUnion(teacherId),
    });
  }

  static removeTeacher(courseId: string, teacherId: string) {
    return FirebaseService.updateDoc(COL, courseId, {
      teacherIds: FirebaseService.FieldValue.arrayRemove(teacherId),
    });
  }
}
