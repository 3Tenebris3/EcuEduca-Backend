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
