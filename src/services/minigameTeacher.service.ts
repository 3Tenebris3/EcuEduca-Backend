import { MinigameResumeDTO, MinigameStudentDTO } from "../domain/dtos/minigameTeacher.dto";
import { getClassStudents } from "./class.service";
import { db } from "../config/firebaseAdmin";

/* ---------- helpers ---------- */
function percent(score: number, max: number = 100) {
  return Math.round((score / max) * 100);
}

/* ---------- LIST (agrupado) ---------- */
export async function listTeacherMinigames(teacherId: string, classId?: string) {
  const classes = classId ? [classId] : await getClassIdsForTeacher(teacherId);

  const result: MinigameResumeDTO[] = [];

  for (const cid of classes) {
    const students = await getClassStudents(cid);
    const stuIds   = students.map((s) => s.id);

    const snap = await db
      .collection("userProgress")
      .where("classId", "==", cid)
      .where("type", "==", "minigame")
      .get();

    const grouped: Record<string, { attempts: number; totalScore: number }> = {};

    snap.docs.forEach((d) => {
      const { refId, score } = d.data();
      if (!grouped[refId]) grouped[refId] = { attempts: 0, totalScore: 0 };
      grouped[refId].attempts += 1;
      grouped[refId].totalScore += score ?? 0;
    });

    Object.entries(grouped).forEach(([mid, g]) =>
      result.push({
        id: mid,
        title: mid.replace(/_/g, " "), // placeholder
        classId: cid,
        attempts: g.attempts,
        avgScore: Math.round(g.totalScore / g.attempts) || 0,
        total: stuIds.length,
      })
    );
  }

  return result;
}

/* ---------- DETAIL ---------- */
export async function getMinigameDetail(
  minigameId: string,
  classId: string,
): Promise<{ meta: MinigameResumeDTO; students: MinigameStudentDTO[] }> {
  const students = await getClassStudents(classId);

  const snap = await db
    .collection("userProgress")
    .where("classId", "==", classId)
    .where("type", "==", "minigame")
    .where("refId", "==", minigameId)
    .get();

  const byStudent: Record<
    string,
    { attempts: number; best: number }
  > = {};

  snap.docs.forEach((d) => {
    const { userId, score } = d.data();
    if (!byStudent[userId])
      byStudent[userId] = { attempts: 0, best: 0 };
    byStudent[userId].attempts += 1;
    byStudent[userId].best = Math.max(byStudent[userId].best, score ?? 0);
  });

  const detail: MinigameStudentDTO[] = students.map((s) => ({
    studentId: s.id,
    name: s.displayName,
    attempts: byStudent[s.id]?.attempts ?? 0,
    bestScore: byStudent[s.id]?.best ?? 0,
  }));

  const meta: MinigameResumeDTO = {
    id: minigameId,
    title: minigameId.replace(/_/g, " "),
    classId,
    attempts: snap.size,
    avgScore:
      snap.size === 0
        ? 0
        : Math.round(
            snap.docs.reduce((sum, d) => sum + (d.data().score ?? 0), 0) /
              snap.size,
          ),
    total: students.length,
  };

  return { meta, students: detail };
}

/* Util para obtener ids de clase del profe */
async function getClassIdsForTeacher(teacherId: string) {
  const snap = await db
    .collection("classes")
    .where("teacherId", "==", teacherId)
    .get();
  return snap.docs.map((d) => d.id);
}
