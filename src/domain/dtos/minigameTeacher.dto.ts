/*  resumen para la tabla  */
export interface MinigameResumeDTO {
  id:          string;
  title:       string;
  classId:     string;
  attempts:    number;  // nº de partidas registradas
  avgScore:    number;  // promedio 0-100
  total:       number;  // alumnos de la clase
}

/*  detalle por alumno  */
export interface MinigameStudentDTO {
  studentId: string;
  name:      string;
  attempts:  number;
  bestScore: number;      // 0-100
}
