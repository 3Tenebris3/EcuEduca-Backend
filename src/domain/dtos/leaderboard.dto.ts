export interface LeaderboardRowDTO {
  id: string;        // uid
  name: string;
  avatar: string;    // "avatar4.png"
  points: number;
  rank?: number;     // solo al enviar al cliente
}

export interface AddPointsDTO {
  delta: number;     // puntos a sumar
}
