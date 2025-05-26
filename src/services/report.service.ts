import { db } from '../config/firebaseAdmin';
import { ClassSummaryDTO, StudentReportDTO } from "../domain/dtos/report.dto";

export class ReportService {
  /** ───── quick summary ───── */
  static async summary(classId: string): Promise<ClassSummaryDTO> {
    const studentsSnap = await db.collection("users")
      .where("classes", "array-contains", classId)
      .get();

    const studentIds = studentsSnap.docs.map(d => d.id);
    const totalStudents = studentIds.length || 1;

    const progressSnap = await db.collection("userProgress")
      .where("userId", "in", studentIds)
      .get();

    let scenarios = 0, minigames = 0, points = 0;
    progressSnap.docs.forEach(d => {
      const p = d.data();
      scenarios += p.scenariosCompleted?.length || 0;
      minigames += p.minigamesCompleted?.length || 0;
      points    += p.points || 0;
    });

    return {
      classId,
      students: totalStudents,
      scenariosPct: +(scenarios / (totalStudents *  /*máxEsc*/ 10) * 100).toFixed(1),
      minigamesPct: +(minigames / (totalStudents * /*máxMini*/ 15) * 100).toFixed(1),
      avgPoints:    +(points / totalStudents).toFixed(1),
    };
  }

  /** ───── table of students ───── */
  static async students(classId: string): Promise<StudentReportDTO[]> {
    const usersSnap = await db.collection("users")
      .where("classes", "array-contains", classId)
      .get();

    const rows: StudentReportDTO[] = [];
    for (const doc of usersSnap.docs) {
      const u = doc.data();
      const prog = await db.collection("userProgress").doc(doc.id).get();
      const p = prog.exists ? prog.data() : {};

      rows.push({
        id:            doc.id,
        displayName:   u.displayName,
        email:         u.email,
        scenariosDone: p?.scenariosCompleted?.length || 0,
        minigamesDone: p?.minigamesCompleted?.length || 0,
        points:        p?.points || 0,
      });
    }
    return rows;
  }
}
