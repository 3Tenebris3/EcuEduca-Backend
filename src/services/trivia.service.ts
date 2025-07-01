import {
  TriviaSetDTO,
  TriviaSummaryDTO,
  TriviaSubmitDTO,
  CreateTriviaSetDTO,
  UpdateTriviaSetDTO,
  CreateQuestionDTO,
  UpdateQuestionDTO,
} from "../domain/dtos/trivia.dto";
import { db } from "../config/firebaseAdmin";
import { firestore } from "firebase-admin";

const setsCol = db.collection("triviaSets");

/* ---------- alumno ---------- */
export class TriviaService {
  /* set completo (preguntas) */
  static async getSet(id: string): Promise<TriviaSetDTO | null> {
    const snap = await setsCol.doc(id).get();
    if (!snap.exists) return null;

    // ── extraemos y descartamos el id interno ──
    const { id: _omit, ...data } = snap.data() as TriviaSetDTO;

    // ahora solo existe un id
    return { id: snap.id, ...data };
  }

  /* lista + flag completado */
  static async listForUser(userId: string): Promise<TriviaSummaryDTO[]> {
    const [setsSnap, scoresSnap] = await Promise.all([
      setsCol.get(),
      db.collection("users").doc(userId).collection("triviaScores").get(),
    ]);

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

  /* guardar resultado y sumar puntos */
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

  /* ================================================================ */
  /*                       ⬇️  ADMIN CRUD                            */
  /* ================================================================ */

  /* ---- SETS ---- */
  static async createSet(dto: CreateTriviaSetDTO) {
    const ref = await setsCol.add({ title: dto.title, questions: [] });
    return { id: ref.id, title: dto.title } as TriviaSetDTO;
  }

  static async updateSet(id: string, dto: UpdateTriviaSetDTO) {
    // 1️⃣ — cast para evitar el error de ‘AddPrefixToKeys’
    await setsCol.doc(id).update(dto as any);

    const snap = await setsCol.doc(id).get();
    if (!snap.exists) throw new Error("Set not found");

    // 2️⃣ — doc.data() no trae ‘id’; aun así, por seguridad omitimos si existiera
    const { id: _discard, ...data } = snap.data() as { [k: string]: any };

    // devolvemos un objeto bien tipado sin duplicar la clave
    return { id, ...(data as Omit<TriviaSetDTO, "id">) };
  }

  static async deleteSet(id: string) {
    await setsCol.doc(id).delete();
  }

  /* ---- PREGUNTAS ---- */

  /** añade pregunta y devuelve el set actualizado */
  static async addQuestion(
    setId: string,
    dto: CreateQuestionDTO
  ): Promise<TriviaSetDTO> {
    if (!dto.options.includes(dto.answer))
      throw new Error("answer must exist in options");

    const newQ = { id: db.collection("_").doc().id, ...dto };
    await setsCol.doc(setId).update({
      questions: firestore.FieldValue.arrayUnion(newQ),
    });
    return (await setsCol.doc(setId).get()).data() as TriviaSetDTO;
  }

  /** editar pregunta */
  static async updateQuestion(
    setId: string,
    questionId: string,
    dto: UpdateQuestionDTO
  ) {
    const doc = await setsCol.doc(setId).get();
    if (!doc.exists) throw new Error("Set not found");

    const data = doc.data() as TriviaSetDTO;
    const idx = data.questions.findIndex((q) => q.id === questionId);
    if (idx === -1) throw new Error("Question not found");

    const merged = { ...data.questions[idx], ...dto };
    if (!merged.options.includes(merged.answer))
      throw new Error("answer must exist in options");

    data.questions[idx] = merged;
    await setsCol.doc(setId).update({ questions: data.questions });
  }

  /** eliminar pregunta */
  static async deleteQuestion(setId: string, questionId: string) {
    const doc = await setsCol.doc(setId).get();
    if (!doc.exists) throw new Error("Set not found");

    const data = doc.data() as TriviaSetDTO;
    const next = data.questions.filter((q) => q.id !== questionId);
    await setsCol.doc(setId).update({ questions: next });
  }
}
