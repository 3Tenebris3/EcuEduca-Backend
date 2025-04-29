import { db } from '../config/firebaseAdmin';
import { ReportDTO } from '../domain/dtos/report.dto';

const DOC = 'admin/reports/daily';

export class ReportService {

  /** Lee el snapshot actual */
  static async get(): Promise<ReportDTO | null> {
    const doc = await db.doc(DOC).get();
    return doc.exists ? (doc.data() as ReportDTO) : null;
  }

  /** Recalcula usando datos en Firestore */
  static async rebuild(): Promise<ReportDTO> {
    /* -------- usuarios -------- */
    const usersSnap = await db.collection('users').get();
    const totalUsers = usersSnap.size;

    /* -------- clases activas -------- */
    const clsSnap = await db.collection('classes').where('isActive','==',true).get();
    const activeClasses = clsSnap.size;

    /* -------- promedio quizzes -------- */
    const gradesSnap = await db.collection('grades')
                               .where('type','==','quiz').get();
    const avgQuiz = gradesSnap.empty
        ? 0
        : gradesSnap.docs.reduce((s,d)=>s + d.data().score,0) / gradesSnap.size;

    /* -------- escenario y minijuego top (simple count) -------- */
    const scenCount: Record<string,number> = {};
    const miniCount: Record<string,number> = {};
    gradesSnap.docs.forEach(d=>{
      const g=d.data();
      if (g.type==='quiz' && g.moduleId?.startsWith('mod-3d'))
        scenCount[g.moduleId]=(scenCount[g.moduleId]??0)+1;
      if (g.type==='minigame')
        miniCount[g.moduleId]=(miniCount[g.moduleId]??0)+1;
    });
    const topScenarios = Object.entries(scenCount)
                               .sort((a,b)=>b[1]-a[1])
                               .slice(0,3)
                               .map(e=>e[0]);
    const mostPlayedMinigame = Object.entries(miniCount)
                                     .sort((a,b)=>b[1]-a[1])[0]?.[0] ?? '';

    /* -------- construir objeto -------- */
    const report: ReportDTO = {
      totalUsers,
      activeClasses,
      topScenarios,
      averageQuizScores: Number(avgQuiz.toFixed(2)),
      mostPlayedMinigame,
      generatedAt: new Date()
    };

    // guardar
    await db.doc(DOC).set(report);
    return report;
  }
}
