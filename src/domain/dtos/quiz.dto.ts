export interface QuizSetDTO {
  id:    string;
  title: string;
  total: number;
}

export interface QuizQuestionDTO {
  id:      string;
  prompt:  string;
  choices: string[];
  answer:  number;       // índice correcto (0-3) – *no enviar al cliente*
}

export interface SubmitQuizDTO {
  quizId:   string;
  answers:  number[];    // índice elegido por el alumno
}

/* …lo que ya tenías arriba… */

/* ───────── Admin CRUD ───────── */
export interface CreateQuizSetDTO {
  title: string;
}

export interface UpdateQuizSetDTO extends Partial<CreateQuizSetDTO> {}

export interface CreateQuestionDTO {
  prompt:  string;
  choices: [string, string, string, string]; // siempre 4
  answer:  number;                           // 0-3
}

export interface UpdateQuestionDTO extends Partial<CreateQuestionDTO> {}
