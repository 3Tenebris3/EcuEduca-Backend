/* Escena que ve el front */
export interface SceneMetaDTO {
  id:        string;
  title:     string;
  preview:   string;        // miniatura PNG/JPG pública
  completed: boolean;       // ← calculado por el servicio
}

/* Al crear/editar desde admin */
export interface CreateSceneDTO {
  id:      string;
  title:   string;
  preview: string;          // url firmada o pública
  glbUrl:  string;          // modelo 3-D
  audio?:  string;          // narración opcional
}
