/* ---------- modelos ya usados por el alumno ---------- */
export interface TriviaQuestionDTO {
  id:      string;
  text:    string;
  options: string[];
  answer:  string;   // valor correcto
}

export interface TriviaSetDTO {
  id:        string;
  title:     string;
  questions: TriviaQuestionDTO[];
}

/* ---------- lista para el menú del alumno ---------- */
export interface TriviaSummaryDTO {
  id:        string;
  title:     string;
  completed: boolean;
}

/* ---------- payload alumno ---------- */
export interface TriviaSubmitDTO {
  setId:  string;
  score:  number;
  total:  number;
}

/* ------------------------------------------------------------------ */
/*              ⬇️  NUEVOS DTOs para panel admin                      */
/* ------------------------------------------------------------------ */
export interface CreateTriviaSetDTO {
  title: string;
}

export interface UpdateTriviaSetDTO {
  title?: string;
}

export interface CreateQuestionDTO {
  text:    string;
  options: [string, string, string, string]; // exactamente 4 opciones
  answer:  string;                           // debe existir en options
}

export interface UpdateQuestionDTO extends Partial<CreateQuestionDTO> {}
