/**
 * DTO para crear una clase.
 * Solo exige el nombre; el controlador rellenará teacherIds, etc.
 */
export interface CreateClassDTO {
    className:  string;
    teacherIds?: string[];
  }
  
  /**
   * DTO para actualizar clase: todo opcional.
   */
  export interface UpdateClassDTO {
    className?:  string;
    teacherIds?: string[];
    students?:   string[];
    isActive?:   boolean;
    updatedAt?:  Date;
  }
  