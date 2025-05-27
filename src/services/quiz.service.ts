import { db } from "../config/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import {
  QuizSetDTO,
  QuizQuestionDTO,
  SubmitQuizDTO,
  CreateQuestionDTO,
  CreateQuizSetDTO,
  UpdateQuestionDTO,
  UpdateQuizSetDTO,
} from "../domain/dtos/quiz.dto";

const QUIZ_COLL   = db.collection("quizzes");
const SCORE_COLL  = (uid: string) => db.collection("scores").doc(uid).collection("quizzes");

/* ---------- list sets ---------- */
export async function listSets(): Promise<QuizSetDTO[]> {
  const snap = await QUIZ_COLL.get();
  return snap.docs.map((d) => ({
    id:    d.id,
    title: d.data().title,
    total: d.data().total,
  }));
}

/* ---------- user scores map ---------- */
export async function userScores(uid: string) {
  const snap = await SCORE_COLL(uid).get();
  const out: Record<string, { score: number; total: number }> = {};
  snap.docs.forEach((d) => (out[d.id] = d.data() as any));
  return out;
}

/* ---------- questions for a set ---------- */
export async function getQuestions(quizId: string): Promise<QuizQuestionDTO[]> {
  const snap = await QUIZ_COLL.doc(quizId).collection("questions").get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

/* ---------- submit answers ---------- */
export async function submit(uid: string, dto: SubmitQuizDTO) {
  /* obtener preguntas para validar respuestas */
  const questions = await getQuestions(dto.quizId);
  const total   = questions.length;
  const correct = questions.reduce(
    (acc, q, i) => acc + (q.answer === dto.answers[i] ? 1 : 0),
    0
  );

  /* guarda score */
  await SCORE_COLL(uid).doc(dto.quizId).set({ score: correct, total });

  /* también actualiza puntos del usuario */
  const points = correct * 5; // 5 pts por acierto
  const userRef = db.collection("users").doc(uid);
  await userRef.update({ points: FieldValue.increment(points) });

  return { score: correct, total, gained: points };
}


export async function createSet(dto: CreateQuizSetDTO): Promise<QuizSetDTO> {
  const ref = await QUIZ_COLL.add({ ...dto, total: 0 });
  return { id: ref.id, title: dto.title, total: 0 };
}

export async function updateSet(
  id: string,
  dto: UpdateQuizSetDTO,
): Promise<QuizSetDTO | null> {
  await QUIZ_COLL.doc(id).update(dto);
  const doc = await QUIZ_COLL.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as any) } as QuizSetDTO;
}

export async function deleteSet(id: string) {
  /* borra set y sus preguntas en un batch */
  const batch = db.batch();
  batch.delete(QUIZ_COLL.doc(id));
  const qsnap = await QUIZ_COLL.doc(id).collection("questions").get();
  qsnap.docs.forEach((q) => batch.delete(q.ref));
  await batch.commit();
}

/* ——————————— ADMIN CRUD (PREGUNTAS) ——————————— */

export async function addQuestion(
  quizId: string,
  dto: CreateQuestionDTO,
): Promise<QuizQuestionDTO> {
  const ref = await QUIZ_COLL.doc(quizId).collection("questions").add(dto);
  /* incrementa contador total en el set */
  await QUIZ_COLL.doc(quizId).update({ total: FieldValue.increment(1) });
  return { id: ref.id, ...dto };
}

export async function updateQuestion(
  quizId: string,
  qId: string,
  dto: UpdateQuestionDTO,
) {
  await QUIZ_COLL.doc(quizId).collection("questions").doc(qId).update(dto);
}

export async function deleteQuestion(quizId: string, qId: string) {
  await QUIZ_COLL.doc(quizId).collection("questions").doc(qId).delete();
  await QUIZ_COLL.doc(quizId).update({ total: FieldValue.increment(-1) });
}