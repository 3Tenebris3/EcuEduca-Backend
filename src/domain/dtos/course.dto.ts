export interface CreateCourseDTO {
    name: string;
    icon?: string;
    teacherIds?: string[];   // varios profesores
  }
  
  export interface UpdateCourseDTO {
    name?: string;
    icon?: string;
    teacherIds?: string[];
    isActive?: boolean;
    updatedAt?: Date;
  }
  