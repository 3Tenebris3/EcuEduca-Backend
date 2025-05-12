export type ModuleType =
  | "3d_static"
  | "3d_animation"
  | "minigame"
  | "quiz"
  | "final_test";

export interface CreateModuleDTO {
  type: ModuleType;
  refId: string;                  // id en /scenarios, /quizzes, …
  order: number;
  custom?: Record<string, any>;
}

export interface UpdateModuleDTO {
  type?: ModuleType;
  refId?: string;
  order?: number;
  custom?: Record<string, any>;
  isActive?: boolean;
  updatedAt?: Date;
}
