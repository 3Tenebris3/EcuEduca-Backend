/**
 * DTO para el login.
 */
export interface LoginDTO {
    email: string;
    password: string;
  }
  
  /**
   * DTO para el registro de usuario.
   */
  export interface RegisterDTO {
    email: string;
    password: string;
    displayName: string;
    role?: string;   // default "student" si no se especifica
  }
  