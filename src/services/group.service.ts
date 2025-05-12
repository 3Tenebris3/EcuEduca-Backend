import { FirebaseService } from "./firebase.service";
import {
  CreateGroupDTO,
  UpdateGroupDTO,
} from "../domain/dtos/group.dto";

const COL = "groups";

export class GroupService {
  private static now() {
    return new Date();
  }

  /* ------------ CRUD ------------ */
  static async create(dto: CreateGroupDTO) {
    const data = {
      ...dto,
      studentIds: [],
      isActive: true,
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    return FirebaseService.createDoc(COL, data);
  }

  static getByCourse(courseId: string, teacherId: string) {
    return FirebaseService.findDocsByField(COL, "courseId", courseId).then((lst) =>
      lst.filter((g: any) => g.teacherId === teacherId)
    );
  }

  static getById(id: string) {
    return FirebaseService.getDocById(COL, id);
  }

  static update(id: string, dto: UpdateGroupDTO) {
    dto.updatedAt = this.now();
    return FirebaseService.updateDoc(COL, id, dto);
  }

  static delete(id: string) {
    return FirebaseService.deleteDoc(COL, id);
  }

  /* ---------- asignar estudiantes ---------- */
  static async addStudent(groupId: string, studentId: string) {
    await FirebaseService.updateDoc(COL, groupId, {
      studentIds: FirebaseService.FieldValue.arrayUnion(studentId),
    });
    await FirebaseService.updateDoc("users", studentId, {
      groupIds: FirebaseService.FieldValue.arrayUnion(groupId),
    });
  }

  static async removeStudent(groupId: string, studentId: string) {
    await FirebaseService.updateDoc(COL, groupId, {
      studentIds: FirebaseService.FieldValue.arrayRemove(studentId),
    });
    await FirebaseService.updateDoc("users", studentId, {
      groupIds: FirebaseService.FieldValue.arrayRemove(groupId),
    });
  }
}
