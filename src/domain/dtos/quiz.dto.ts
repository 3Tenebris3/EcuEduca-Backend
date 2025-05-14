/* ---------- Quiz (encabezado) ---------- */
export interface CreateQuizDTO {
  title:           string;
  relatedScenario?: string;      // opcional
  maxAttempts?:    number;       // 0 = ilimitado
  durationSec?:    number;       // 0 = sin límite de tiempo
}

export interface UpdateQuizDTO extends Partial<CreateQuizDTO> {
  isActive?: boolean;
  updatedAt?: Date;
}

/* ---------- Preguntas ---------- */
export type QuestionType = "multiple_choice" | "true_false" | "short_answer";

/** Cada pregunta guarda sus opciones y el índice de la correcta */
export interface CreateQuestionDTO {
  questionText: string;
  type:         QuestionType;
  order:        number;          // 1, 2, 3…
  options:      string[];        // respuestas visibles
  correct:      number;          // índice en `options`
  createdAt?:   Date;
}

export interface UpdateQuestionDTO
  extends Partial<Omit<CreateQuestionDTO, "order">> {
  order?:      number;
  updatedAt?:  Date;
}

/* ---------- Attempts ---------- */
export interface CreateAttemptDTO {
  quizId:     string;
  userId:     string;
  startedAt:  Date;
  answers:    number[];          // índice marcado por el alumno (-1 sin responder)
}

export interface SubmitQuizDTO {
  attemptId: string;
  answers:   number[];           // array completo al “Enviar”
}
