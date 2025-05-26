export interface ClassSummaryDTO {
  classId:      string;
  students:     number;
  scenariosPct: number;   // 0‒100
  minigamesPct: number;
  avgPoints:    number;
}

export interface StudentReportDTO {
  id:            string;
  displayName:   string;
  email:         string;
  scenariosDone: number;
  minigamesDone: number;
  points:        number;
}
