import { db, admin } from "../config/firebaseAdmin";
import { FBQuestionDTO, SubmitFBDTO } from "../domain/dtos/fillblank.dto";

const COLL  = db.collection("minigames").doc("fillblank").collection("sets");
const SCORE = (uid: string) =>
  db.collection("scores").doc(uid).collection("fillblank");

/* ---------- preguntas de un set ---------- */
export async function getQuestions(setId: string): Promise<FBQuestionDTO[]> {
  const qs = await COLL.doc(setId).collection("questions").get();
  return qs.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

/* ---------- envío de respuestas ---------- */
export async function submit(uid: string, dto: SubmitFBDTO) {
  const questions = await getQuestions(dto.setId);
  if (dto.answers.length !== questions.length)
    throw new Error("answers_length_mismatch");

  const total   = questions.length;
  const correct = questions.reduce(
    (acc, q, i) => acc + (q.answer === dto.answers[i] ? 1 : 0),
    0
  );
  const gained  = correct * 5;          // 5 puntos por acierto

  /* guarda score + puntos */
  await db.runTransaction(async (t) => {
    /* score del set */
    t.set(SCORE(uid).doc(dto.setId), { score: correct, total });

    /* puntos acumulados */
    const userRef = db.collection("users").doc(uid);
    t.update(userRef, { points: admin.firestore.FieldValue.increment(gained) });
  });

  return { score: correct, total, gained };
}

export async function listSets() {
  const snap = await COLL.get();
  return snap.docs.map((d) => ({
    id: d.id,
    title: d.data().title,
    total: d.data().total,
  }));
}

export async function userScores(uid: string) {
  const snap = await SCORE(uid).get();
  const map: Record<string, { score: number; total: number }> = {};
  snap.docs.forEach((d) => (map[d.id] = d.data() as any));
  return map;
}
