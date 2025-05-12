import { FirebaseService } from "./firebase.service";
import { CreateGradeDTO, GradeQuery } from "../domain/dtos/grade.dto";
import { Query } from "firebase-admin/firestore";

const COL = "grades";

export class GradeService {
  /* CREATE */
  static create(dto: CreateGradeDTO) {
    return FirebaseService.createDoc(COL, {
      ...dto,
      date: new Date(),
    });
  }

  /* LIST / FILTER */
  static async list(q: GradeQuery) {
    let query: Query = FirebaseService.collectionRef(COL);

    if (q.groupId) query = query.where("groupId", "==", q.groupId);
    else if (q.classId) query = query.where("classId", "==", q.classId); // legacy

    if (q.unitId) query = query.where("unitId", "==", q.unitId);
    if (q.userId) query = query.where("userId", "==", q.userId);

    const snap = await query.get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}
