import { db } from "../config/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import {
  QuizSetDTO,
  QuizQuestionDTO,
  SubmitQuizDTO,
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
