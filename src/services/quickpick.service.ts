import { firestore } from "firebase-admin";
import {
  QPItemDTO,
  QPThemeDTO,
  QPSubmitDTO,
} from "../domain/dtos/quickpick.dto";
import { db } from "../config/firebaseAdmin";

const setsCol = db.collection("quickpickSets");

export class QuickPickService {
  /* -------- obtener tema -------- */
  static async getTheme(id: string): Promise<QPThemeDTO | null> {
    const doc = await setsCol.doc(id).get();
    if (!doc.exists) return null;
    const d = doc.data()!;
    return {
      id:         doc.id,
      bg:         d.bg,
      targets:    d.targets as QPItemDTO[],
      distractors:d.distractors as QPItemDTO[],
    };
  }

  /* -------- procesar score -------- */
  static async submit(
    userId: string,
    dto: QPSubmitDTO
  ): Promise<{ gained: number }> {
    // fórmula sencilla: 3 pts por acierto – 1 pt por fallo (mín 0)
    const gained = Math.max(dto.hits * 3 - dto.misses, 0);

    const scoreRef = db
      .collection("users")
      .doc(userId)
      .collection("quickpickScores")
      .doc(dto.setId);

    await scoreRef.set(
      {
        hits: dto.hits,
        misses: dto.misses,
        gained,
        playedAt: new Date(),
      },
      { merge: true }
    );

    // actualiza total de puntos del usuario
    await db
      .collection("users")
      .doc(userId)
      .set({ points: firestore.FieldValue.increment(gained) }, { merge: true });

    return { gained };
  }
}
