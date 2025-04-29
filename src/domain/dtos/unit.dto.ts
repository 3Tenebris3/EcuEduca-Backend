export interface CreateUnitDTO {
    title: string;
    order: number;           // 1, 2, 3…
  }
  
  export interface UpdateUnitDTO {
    title?: string;
    order?: number;
    isActive?: boolean;
    updatedAt?: Date;
  }
  