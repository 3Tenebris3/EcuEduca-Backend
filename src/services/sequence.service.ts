import { firestore } from "firebase-admin";
import {
  SeqSetDTO,
  SeqSetSummaryDTO,
  SeqSubmitDTO,
} from "../domain/dtos/sequence.dto";
import { db } from "../config/firebaseAdmin";

const setsCol = db.collection("sequenceSets");

export class SequenceService {
  /* ---------- obtener secuencia ---------- */
  static async getSet(id: string): Promise<SeqSetDTO | null> {
    const doc = await setsCol.doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    return { id: doc.id, items: data.items };
  }

  /* ---------- guardar score & puntos ---------- */
  static async submit(
    userId: string,
    dto: SeqSubmitDTO
  ): Promise<{ gained: number }> {
    const gained = dto.correct * 5; // 5 pts por acierto

    await db
      .collection("users")
      .doc(userId)
      .collection("sequenceScores")
      .doc(dto.setId)
      .set({ ...dto, gained, playedAt: new Date() });

    await db
      .collection("users")
      .doc(userId)
      .set({ points: firestore.FieldValue.increment(gained) }, { merge: true });

    return { gained };
  }

  /* ---------- (nuevo) listar sets para el usuario ---------- */
  static async listForUser(userId: string): Promise<SeqSetSummaryDTO[]> {
    const setsSnap = await setsCol.get();               // todos los sets
    const scoresSnap = await db
      .collection("users")
      .doc(userId)
      .collection("sequenceScores")
      .get();                                          // partidas del user

    const scoreMap: Record<string, number> = {};
    scoresSnap.forEach((d) => {
      const { correct } = d.data() as { correct: number };
      scoreMap[d.id] = correct;
    });

    const result: SeqSetSummaryDTO[] = [];
    setsSnap.forEach((doc) => {
      const { title, items } = doc.data() as { title: string; items: any[] };
      const correct = scoreMap[doc.id] ?? 0;
      result.push({
        id:        doc.id,
        title,
        completed: correct === items.length && items.length > 0,
      });
    });

    return result;
  }
}
