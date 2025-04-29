export interface CreateScenarioDTO {
    title:            string;
    historicalPeriod: string;
    modelURL:         string;
    audioNarrationURL?: string;
    description:      string;
    thumbURL?:        string;
    createdAt?: Date;
  }
  
  export interface UpdateScenarioDTO extends Partial<CreateScenarioDTO> {
    isActive?: boolean;
    updatedAt?: Date;
  }
  
  /* Punto de interés -------------------------------- */
  export interface CreatePointDTO {
    title: string;
    description: string;
    iconURL?: string;
    audioURL?: string;
    order?: number;
    createdAt?: Date;
  }
  export interface UpdatePointDTO extends Partial<CreatePointDTO> {
    updatedAt?: Date;
  }
  