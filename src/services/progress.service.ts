/* src/services/progress.service.ts */
import { firestore } from "firebase-admin";
import {
  MinigameProgressDTO,
  ScenarioProgressDTO,
} from "../domain/dtos/progress.dto";
import { db } from "../config/firebaseAdmin";

export class ProgressService {
  // ---------- Escenarios ----------
  static async saveScenario(uid: string, dto: ScenarioProgressDTO) {
    const col = db
      .collection("userProgress")
      .doc(uid)
      .collection("scenarios");
    await col.doc(dto.scenarioId).set(
      {
        completed: true,
        completedAt: dto.completedAt ?? new Date(),
      },
      { merge: true }
    );
  }

  // ---------- Minijuegos ----------
  static async saveMinigame(uid: string, dto: MinigameProgressDTO) {
    const col = db
      .collection("userProgress")
      .doc(uid)
      .collection("minigames");
    await col.doc(dto.gameId).set(
      {
        lastScore: dto.score,
        lastPlayed: dto.playedAt ?? new Date(),
        bestScore: firestore.FieldValue.increment(
          0 /* placeholder, será sustituido abajo */
        ),
      },
      { merge: true }
    );

    /* actualiza bestScore si aplica */
    const snap = await col.doc(dto.gameId).get();
    const data = snap.data() as any;
    if (!data.bestScore || dto.score > data.bestScore) {
      await col.doc(dto.gameId).update({ bestScore: dto.score });
    }
  }

  // ---------- Lecturas para profesor ----------
  static async scenarioSummary(classId: string) {
    /* Devuelve % completado por escenario dentro del aula */
    /* Leer todos los alumnos de la clase              */
    const users = await db
      .collection("users")
      .where("classId", "==", classId)
      .get();

    const totals: Record<string, { done: number; total: number }> = {};

    await Promise.all(
      users.docs.map(async (u) => {
        const scenCol = db
          .collection("userProgress")
          .doc(u.id)
          .collection("scenarios");
        const scenDocs = await scenCol.get();
        scenDocs.forEach((d) => {
          const id = d.id;
          totals[id] = totals[id] || { done: 0, total: 0 };
          totals[id].done += 1;
        });
        /* contará aunque no tenga nada */
        scenCol.get().then(() => {
          Object.values(totals).forEach((t) => (t.total += 1));
        });
      })
    );

    return totals;
  }

  static async minigameSummary(classId: string) {
    const users = await db
      .collection("users")
      .where("classId", "==", classId)
      .get();

    const stats: Record<
      string,
      { plays: number; avg: number; best: number }
    > = {};

    await Promise.all(
      users.docs.map(async (u) => {
        const mgCol = db
          .collection("userProgress")
          .doc(u.id)
          .collection("minigames");
        const docs = await mgCol.get();
        docs.forEach((d) => {
          const { lastScore, bestScore } = d.data() as any;
          const obj = (stats[d.id] = stats[d.id] || {
            plays: 0,
            avg: 0,
            best: 0,
          });
          obj.plays += 1;
          obj.avg += lastScore;
          obj.best = Math.max(obj.best, bestScore ?? 0);
        });
      })
    );

    // promedios
    Object.values(stats).forEach((s) => {
      if (s.plays) s.avg = Number((s.avg / s.plays).toFixed(2));
    });

    return stats;
  }
}
