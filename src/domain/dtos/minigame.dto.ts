export type MinigameType =
  | 'puzzle'
  | 'trivia'
  | 'chronology'
  | 'search'
  | 'simulation';

export interface CreateMinigameDTO {
  title:       string;
  description: string;
  type:        MinigameType;
  maxScore?:   number;
}

export interface UpdateMinigameDTO extends Partial<CreateMinigameDTO> {
  isActive?: boolean;
    updatedAt?: Date;
}
