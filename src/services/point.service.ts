import { FieldValue } from "firebase-admin/firestore";
import { AdjustPointsDTO } from "../domain/dtos/points.dto";
import { db } from "../config/firebaseAdmin";

const progressCol = db.collection("userProgress");

export class PointService {

  /* ---------- listado por clase ---------- */
  static async listByClass(classId: string) {
    const students = await db      // ya lo usas en otros servicios
      .collection("users")
      .where("classes", "array-contains", classId)
      .get();

    const rows = await Promise.all(
      students.docs.map(async (doc) => {
        const { displayName, avatar } = doc.data();
        const progSnap = await progressCol.doc(doc.id).get();
        const points   = progSnap.data()?.points ?? 0;
        const rewards  = Object.keys(progSnap.data()?.rewards ?? {});

        return {
          studentId: doc.id,
          name     : displayName,
          avatar,
          points,
          rewards,
        };
      })
    );

    /* orden descendente por puntos */
    return rows.sort((a, b) => b.points - a.points);
  }

  /* ---------- ajuste manual ---------- */
  static async adjust({ studentId, delta, reason }: AdjustPointsDTO, teacherId: string) {
    if (!delta) throw new Error("delta cannot be 0");

    const ref = progressCol.doc(studentId);

    await db.runTransaction(async (tx) => {
      const snap   = await tx.get(ref);
      const before = snap.data()?.points ?? 0;
      tx.set(ref, { points: before + delta }, { merge: true });

      /* historial */
      tx.set(ref.collection("history").doc(), {
        ts   : FieldValue.serverTimestamp(),
        by   : teacherId,
        delta,
        reason : reason ?? null,
      });
    });

    const after = (await ref.get()).data()!;
    return after.points;
  }
}
