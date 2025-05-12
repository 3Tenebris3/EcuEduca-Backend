import { AvatarKey, UserRole } from "../dtos/user.dto";

/**
 * Modelo que representa a un usuario en la base de datos.
 */
export interface UserModel {
  id?:          string;      // (Firestore doc id)
  email:        string;
  password:     string;
  displayName:  string;
  roles:        UserRole[];
  classes:      string[];
  phone?:       string;
  avatar?:      AvatarKey;
  teacherId?:   string;
  createdAt:    Date;
  updatedAt:    Date;
  o365Id?:        string;
  profilePicture?:string;
  progress?: {
    unitsCompleted?: Record<string, { avg:number, passed:boolean }>;
    totalScore?:    number;
  };
}
