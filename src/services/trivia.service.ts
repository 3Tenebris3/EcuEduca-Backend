import { firestore } from "firebase-admin";
import {
  TriviaSetDTO,
  TriviaSummaryDTO,
  TriviaSubmitDTO,
} from "../domain/dtos/trivia.dto";
import { db } from "../config/firebaseAdmin";

const setsCol = db.collection("triviaSets");

export class TriviaService {
  /* obtener un set completo */
  static async getSet(id: string): Promise<TriviaSetDTO | null> {
    const doc = await setsCol.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as TriviaSetDTO;
  }

  /* lista para el usuario */
  static async listForUser(userId: string): Promise<TriviaSummaryDTO[]> {
    const setsSnap   = await setsCol.get();
    const scoresSnap = await db
      .collection("users")
      .doc(userId)
      .collection("triviaScores")
      .get();

    const scoreMap: Record<string, number> = {};
    scoresSnap.forEach((d) => (scoreMap[d.id] = d.data().score));

    const list: TriviaSummaryDTO[] = [];
    setsSnap.forEach((doc) => {
      const { title, questions } = doc.data() as TriviaSetDTO;
      const score = scoreMap[doc.id] ?? 0;
      list.push({
        id: doc.id,
        title,
        completed: score === questions.length,
      });
    });
    return list;
  }

  /* guardar resultado y sumar puntos (5 pts por acierto) */
  static async submit(
    userId: string,
    dto: TriviaSubmitDTO
  ): Promise<{ gained: number }> {
    const gained = dto.score * 5;
    await db
      .collection("users")
      .doc(userId)
      .collection("triviaScores")
      .doc(dto.setId)
      .set({ ...dto, gained, playedAt: new Date() });

    await db
      .collection("users")
      .doc(userId)
      .set({ points: firestore.FieldValue.increment(gained) }, { merge: true });

    return { gained };
  }
}
