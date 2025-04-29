export interface CreateGradeDTO {
    userId:    string;
    classId:   string;
    unitId:    string;
    moduleId:  string;          // id del módulo (3d/minigame/quiz/final)
    type:      'minigame' | 'quiz' | 'final_test';
    score:     number;
    maxScore:  number;
    duration?: number;          // en segundos
  }
  
  export interface GradeQuery {
    classId?: string;
    unitId?:  string;
    userId?:  string;
  }
  