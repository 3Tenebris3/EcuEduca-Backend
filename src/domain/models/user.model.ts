/**
 * Modelo que representa a un usuario en la base de datos.
 */
export interface UserModel {
  id?: string;
  email: string;
  displayName: string;
  password?: string;            // Se almacena la contraseña cifrada
  roles: string[];              // Ejemplo: ["student"], ["teacher", "admin"]
  classes: string[];            // IDs de clases a las que pertenece el usuario
  o365Id?: string;              // Opcional, para integración con Office 365
  profilePicture?: string;      // URL de la foto del usuario
  createdAt?: Date;
  updatedAt?: Date;
  progress?: {
    scenariosVisited?: string[];
    minigamesCompleted?: string[];
    quizzesCompleted?: string[];
    totalScore?: number;
  };
}

