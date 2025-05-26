/* Par (para el editor / admin) */
export interface MemoryPairDTO {
  id:     string;              // “colon”
  name:   string;              // “Cristóbal Colón”
  imgUrl: string;              // URL pública (Firebase Storage, GitHub raw, etc.)
}

/* Lo que recibe el front al LISTAR pares */
export interface MemoryPairResponse {
  id:     string;
  name:   string;
  imgUrl: string;
}

/* POST /submit */
export interface SubmitMemoryDTO {
  setId: string;               // “world_explorers”
  moves: number;               // movimientos consumidos
}
