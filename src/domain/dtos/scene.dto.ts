/* ---------- DTOs visibles para el alumno ---------- */
export interface SceneMetaDTO {
  id:        string;
  title:     string;
  preview:   string;   // URL de miniatura
  completed: boolean;
}

/* ---------- payloads que usa el panel admin ---------- */
/* domain/dtos/scene.dto */
export interface CreateSceneDTO {
  id:      string;
  title:   string;
  preview: string;
  glbUrl:  string;
  audio?:  string;
  desc:    string;          // ← NUEVO
}


export interface UpdateSceneDTO extends Partial<Omit<CreateSceneDTO, "id">> {}
