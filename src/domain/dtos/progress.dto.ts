/* src/domain/dtos/progress.dto.ts */
export interface ScenarioProgressDTO {
  scenarioId: string;         // ID del escenario
  completedAt?: Date | string; // default: now
}

export interface MinigameProgressDTO {
  gameId: string;             // memory1, qp2, …
  score:  number;
  playedAt?: Date | string;    // default: now
}
