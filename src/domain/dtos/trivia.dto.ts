export interface TriviaQuestionDTO {
  id:      string;
  text:    string;
  options: string[];
  answer:  string;
}

export interface TriviaSetDTO {
  id:        string;
  title:     string;            // para la lista
  questions: TriviaQuestionDTO[];
}

/* lista para el menú */
export interface TriviaSummaryDTO {
  id:        string;
  title:     string;
  completed: boolean;
}

/* payload que envía el jugador */
export interface TriviaSubmitDTO {
  setId:  string;
  score:  number;
  total:  number;
}
