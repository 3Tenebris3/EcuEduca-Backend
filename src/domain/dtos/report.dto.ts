export interface ReportDTO {
    totalUsers:          number;
    activeClasses:       number;
    topScenarios:        string[];   // ids
    averageQuizScores:   number;
    mostPlayedMinigame:  string;
    generatedAt:         Date;
  }
  