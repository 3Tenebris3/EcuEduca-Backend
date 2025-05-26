/* ---------- Ajuste manual de puntos ---------- */
export interface AdjustPointsDTO {
  studentId : string;      // UID del alumno
  delta     : number;      // + / -  (nunca 0)
  reason?   : string;      // comentario opcional
}
