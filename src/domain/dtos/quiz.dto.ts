export interface CreateQuizDTO {
  title: string;
  relatedScenario?: string; // opcional para vincular a escenario
  maxAttempts?: number;
}

export interface UpdateQuizDTO extends Partial<CreateQuizDTO> {
  isActive?: boolean;
  updatedAt?: Date;
}

/* ---------- preguntas ---------- */
export type QuestionType = "multiple_choice" | "true_false" | "short_answer";

export interface CreateQuestionDTO {
  questionText: string;
  type: QuestionType;
  order: number;
  createdAt?: Date; 
}

export interface UpdateQuestionDTO extends Partial<CreateQuestionDTO> {
  updatedAt?: Date;
}

/* ---------- respuestas (solo multiple_choice) ---------- */
export interface CreateAnswerDTO {
  answerText: string;
  isCorrect: boolean;
}
export interface UpdateAnswerDTO extends Partial<CreateAnswerDTO> {
  updatedAt?: Date;
}
