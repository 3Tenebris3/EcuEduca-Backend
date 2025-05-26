export interface FBQuestionDTO {
  id: string;
  prompt:  string;          // “El río ___ era vital…”
  choices: string[];        // longitud 2-4
  answer:  number;          // índice correcto
}

export interface SubmitFBDTO {
  setId:   string;          // p.e. “fb1”
  answers: number[];        // índice elegido por el alumno para cada pregunta
}
