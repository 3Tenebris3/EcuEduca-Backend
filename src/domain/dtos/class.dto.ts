export interface ClassDTO {
  id:        string;
  name:      string;
  grade:     string;
  teacherId: string;
  studentsCount?: number;          // 👈  nuevo
}

/* creación / edición (panel admin) */
export interface CreateClassDTO {
  name:      string;
  grade:     string;
  teacherId: string;
}
export interface UpdateClassDTO extends Partial<CreateClassDTO> {}

/* matricular / retirar estudiante */
export interface EnrollDTO {
  studentId: string;
  classId:   string;
  action:    "add" | "remove";
}
