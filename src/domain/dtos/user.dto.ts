/**
 * DTO para cuando recibimos datos de creación/edición de usuario.
 */
export interface UserDTO {
    email: string;
    password: string;
    role?: string;
  }
  