/**
 * Modelo que representa a un usuario en la base de datos.
 */
export interface UserModel {
  id?:            string;
  email:          string;
  displayName:    string;
  password?:      string;   // hash
  roles:          string[];
  classes:        string[];
  o365Id?:        string;
  profilePicture?:string;
  createdAt?:     Date;
  updatedAt?:     Date;
  progress?: {
    unitsCompleted?: Record<string, { avg:number, passed:boolean }>;
    totalScore?:    number;
  };
}
