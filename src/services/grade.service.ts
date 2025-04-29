import { db } from '../config/firebaseAdmin';
import { CreateGradeDTO, GradeQuery } from '../domain/dtos/grade.dto';
import { FirebaseService } from './firebase.service';
const COL = 'grades';

export class GradeService {

  static create(dto: CreateGradeDTO) {
    const data = { ...dto, attemptDate: new Date() };
    return FirebaseService.createDoc(COL, data);
  }

  /** Listar con filtros opcionales */
  static async list(q: GradeQuery) {
    let ref: FirebaseFirestore.Query = db.collection(COL);
    if (q.classId) ref = ref.where('classId', '==', q.classId);
    if (q.unitId)  ref = ref.where('unitId',  '==', q.unitId);
    if (q.userId)  ref = ref.where('userId',  '==', q.userId);

    const snap = await ref.get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}
