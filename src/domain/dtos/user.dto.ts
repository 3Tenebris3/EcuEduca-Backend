/* ───── Roles ───── */
export type UserRole = "student" | "teacher" | "admin";

/* ───── Avatares oficiales ───── */
export const ALLOWED_AVATARS = [
  "avatar1.png","avatar2.png","avatar3.png","avatar4.png","avatar5.png",
  "avatar6.png","avatar7.png","avatar8.png","avatar9.png","avatar10.png",
  "avatar11.png","avatar12.png","avatar13.png","avatar14.png","avatar15.png",
  "avatar16.png","avatar17.png","avatar18.png","avatar19.png","avatar20.png",
] as const;
export type AvatarKey = typeof ALLOWED_AVATARS[number];

/* ───── DTOs que el front consume ───── */
export interface UserDTO {
  id:          string;
  displayName: string;
  email:       string;
  role:        UserRole;
  phone?:      string;
  avatar:      AvatarKey;
  teacherId?:  string;
  points?:     number;
  isActive?:   boolean;
}

/* CREATE / UPDATE desde panel admin */
export interface CreateUserDTO {
  displayName: string;
  email:       string;
  password:    string;
  role?:       UserRole;
  phone?:      string;
  avatar?:     AvatarKey;
  teacherId?:  string;
  isActive?:   boolean;
}
export interface UpdateUserDTO extends Omit<Partial<CreateUserDTO>, "password"> {}

/* PATCH avatar */
export interface UpdateAvatarDTO { avatar: AvatarKey; }

/* POST  change-password */
export interface ChangePasswordDTO { oldPwd: string; newPwd: string; }
