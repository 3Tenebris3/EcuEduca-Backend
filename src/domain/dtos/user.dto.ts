/* Roles permitidos */
export type UserRole = 'student' | 'teacher' | 'admin' | 'parent';

/* Avatares oficiales disponibles */
export const ALLOWED_AVATARS = [
  'avatar1.png',
  'avatar2.png',
  'avatar3.png',
  'avatar4.png',
  'avatar5.png',
  'avatar6.png',
  'avatar7.png',
  'avatar8.png',
  'avatar9.png',
  'avatar10.png',
  'avatar11.png',
  'avatar12.png',
  'avatar13.png',
  'avatar14.png',
  'avatar15.png',
  'avatar16.png',
  'avatar17.png',
  'avatar18.png',
  'avatar19.png',
  'avatar20.png',
] as const;
export type AvatarKey = typeof ALLOWED_AVATARS[number];

/* Ya tenías esto — solo añadimos los campos nuevos */
export interface CreateUserDTO {
  email:        string;
  password:     string;
  displayName:  string;
  role?:        UserRole;
  phone?:       string;
  avatar?:      AvatarKey;
  teacherId?:   string;          // si se crea como estudiante
}

/* Update parcial */
export interface UpdateUserDTO {
  displayName?: string;
  role?:        UserRole;
  phone?:       string;
  avatar?:      AvatarKey;
  teacherId?:   string;
  classes?:     string[];
  o365Id?:      string;
  password?:    string;  // hash (no debe usarse aquí)
  updatedAt?:   Date;
}
