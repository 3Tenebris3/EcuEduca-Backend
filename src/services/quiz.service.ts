import {
  CreateQuizDTO, UpdateQuizDTO,
  CreateQuestionDTO, UpdateQuestionDTO,
  CreateAttemptDTO, SubmitQuizDTO
} from "../domain/dtos/quiz.dto";
import { FirebaseService } from "./firebase.service";
import { GradeService }    from "./grade.service";

const COL = "quizzes";
const ATT = "quizAttempts";
const now = () => new Date();

/* helpers -------------------------------------------------- */
const qPath = (qzId: string) => `${COL}/${qzId}/questions`;

/* Tipos que recibimos de Firestore ------------------------- */
export interface QuizDoc extends CreateQuizDTO {
  id:        string;
  isActive:  boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionDoc extends CreateQuestionDTO {
  id: string;
}

export interface AttemptDoc extends CreateAttemptDTO {
  id:         string;
  finishedAt?: Date;
  score?:      number;
  maxScore?:   number;
  finishedBy?: "submit" | "timeout";
}

/* ========================================================= */
export class QuizService {

  /* ── QUIZZES ──────────────────────────────────────────── */
  static create(dto: CreateQuizDTO & { createdBy: string }) {
    return FirebaseService.createDoc<QuizDoc>(COL, {
      ...dto,
      isActive : true,
      createdAt: now(),
      updatedAt: now(),
    });
  }

  static getAll() {
    return FirebaseService.getCollection<QuizDoc>(COL);
  }

  static getById(id: string) {
    return FirebaseService.getDocById<QuizDoc>(COL, id);
  }

  static update(id: string, dto: UpdateQuizDTO) {
    dto.updatedAt = now();
    return FirebaseService.updateDoc<QuizDoc>(COL, id, dto);
  }

  static delete(id: string) {
    return FirebaseService.deleteDoc(COL, id);
  }

  /* ── QUESTIONS ────────────────────────────────────────── */
  static createQuestion(quizId: string, dto: CreateQuestionDTO) {
    return FirebaseService.createDoc<QuestionDoc>(qPath(quizId), {
      ...dto,
      createdAt: now(),
    });
  }

  static getQuestions(quizId: string) {
    return FirebaseService.getCollection<QuestionDoc>(qPath(quizId));
  }

  static updateQuestion(quizId: string, questionId: string, dto: UpdateQuestionDTO) {
    dto.updatedAt = now();
    return FirebaseService.updateDoc<QuestionDoc>(qPath(quizId), questionId, dto);
  }

  static deleteQuestion(quizId: string, questionId: string) {
    return FirebaseService.deleteDoc(qPath(quizId), questionId);
  }

  /* ── ATTEMPTS ─────────────────────────────────────────── */
  /** Devuelve un intento en curso o crea uno nuevo */
  static async startAttempt(dto: CreateAttemptDTO) {
    const running = await FirebaseService
      .findDocsByField<AttemptDoc>(ATT, "userId", dto.userId)
      .then(list => list.find(a => a.quizId === dto.quizId && !a.finishedAt));

    if (running) return running;

    return FirebaseService.createDoc<AttemptDoc>(ATT, {
      ...dto,
      startedAt : now(),
      answers   : dto.answers,        // normalmente [-1,-1,…]
    });
  }

  /** Cuando el alumno pulsa “Enviar” */
  static async submit({ attemptId, answers }: SubmitQuizDTO) {
    const attempt = await FirebaseService.getDocById<AttemptDoc>(ATT, attemptId);
    if (!attempt) throw new Error("Attempt not found");

    const quiz = await this.getById(attempt.quizId);
    if (!quiz)   throw new Error("Quiz not found");

    const questions = await this.getQuestions(quiz.id);

    /* ¿Excedió el tiempo? ---------------------------------- */
    const elapsedSec = (Date.now() - attempt.startedAt.getTime()) / 1000;
    const expired    = !!quiz.durationSec && elapsedSec > quiz.durationSec;

    /* Calcular nota --------------------------------------- */
    const score = expired
      ? 0
      : questions.reduce(
          (acc, q, idx) => acc + (answers[idx] === q.correct ? 1 : 0),
          0
        );

    /* Guardar intento finalizado --------------------------- */
    await FirebaseService.updateDoc<AttemptDoc>(ATT, attemptId, {
      finishedAt: now(),
      answers,
      score,
      maxScore : questions.length,
      finishedBy: expired ? "timeout" : "submit",
    });

    /* Registrar en /grades -------------------------------- */
    await GradeService.create({
      userId   : attempt.userId,
      type     : "quiz",
      score,
      maxScore : questions.length,
      // classId / unitId / moduleId se completan en la app o en lógica extra
    } as any); // cast rápido: los campos opcionales no afectan

    return { score, maxScore: questions.length, expired };
  }

  static getMyAttempts(userId: string, quizId: string) {
    return FirebaseService.findDocsByField<AttemptDoc>(ATT, "userId", userId)
      .then(arr => arr.filter(a => a.quizId === quizId));
  }
}
