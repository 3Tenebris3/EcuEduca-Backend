/** Tarjeta */
export interface SeqItemDTO {
  id:           string;
  label:        string;
  correctIndex: number;       // posición correcta (0-n)
}

/** Set completo enviado al front */
export interface SeqSetDTO {
  id:    string;
  items: SeqItemDTO[];
}

/** Puntaje que envía el jugador */
export interface SeqSubmitDTO {
  setId:   string;
  correct: number;
  total:   number;
}

/** Resumen para la lista */
export interface SeqSetSummaryDTO {
  id:        string;
  title:     string;
  completed: boolean;
}
