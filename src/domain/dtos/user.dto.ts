/**
 * DTO para cuando recibimos datos de creación/edición de usuario.
 */
export interface UserDTO {
    email: string;
    password: string;
    role?: string;
  }
  
  /** Para registro / creación por admin  */
export interface CreateUserDTO {
  email:        string;
  password:     string;
  displayName:  string;
  role?:        'student' | 'teacher' | 'admin' | 'parent';
}

/** Para actualización parcial */
export interface UpdateUserDTO {
  displayName?: string;
  roles?:       string[];
  classes?:     string[];
  o365Id?:      string;
  profilePicture?: string;
  password?:    string; // hash
  updatedAt?: Date;
}
