/**
 * Representa la entidad de un usuario en la base de datos.
 */
export interface UserModel {
    id: string;
    email: string;
    password?: string; // en caso de almacenar en DB (hash)
    role: string;
    createdAt: Date;
    // ...
  }
  