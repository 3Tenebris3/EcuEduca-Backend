export interface CreateGradeDTO {
  groupId: string; //  ⬅️  NUEVO  (sustituye classId)
  userId: string;
  unitId?: string;
  moduleId?: string; // id del módulo (3d/minigame/quiz/final)
  type: "minigame" | "quiz" | "final_test";
  score: number;
  maxScore: number;
  duration?: number; // en segundos
  classId?: string;
}

/**
 * Parámetros para filtrar:
 *  - groupId  (preferido)
 *  - unitId
 *  - userId
 * (classId queda opcional solo por retro-compatibilidad; puedes eliminarlo
 *  cuando migres todos los datos.)
 */
export interface GradeQuery {
  groupId?: string;
  unitId?: string;
  userId?: string;
  /* deprecated */ classId?: string;
}
