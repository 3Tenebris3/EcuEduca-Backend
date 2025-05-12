export interface CreateGroupDTO {
    courseId:  string;          // FK
    name:      string;          // "7°A"
    teacherId: string;          // dueño
  }
  
  export interface UpdateGroupDTO {
    name?:      string;
    teacherId?: string;
    isActive?:  boolean;
    updatedAt?: Date;
  }
  