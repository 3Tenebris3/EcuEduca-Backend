import bcrypt from "bcryptjs";
import {
  UserRole,
  AvatarKey,
  ALLOWED_AVATARS,
} from "../domain/dtos/user.dto";
import {
  UpdateAvatarDTO,
  ChangePasswordDTO,
  UserDTO,
} from "../domain/dtos/user.dto";
import { db } from "../config/firebaseAdmin";
import { RegisterDTO } from "../domain/dtos/auth.dto";

const COLL = db.collection("users");

/* ----------  AUTH helpers  ---------- */

/** Buscar usuario por email (para login) */
export async function findByEmail(email: string) {
  const snap = await COLL.where("email", "==", email).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...(doc.data() as any) };
}

/** Crear usuario (para register) */
export async function createUser(dto: RegisterDTO) {
  // ¿ya existe?
  const exists = await findByEmail(dto.email);
  if (exists) throw new Error("Email already in use");

  const hash = bcrypt.hashSync(dto.password, 10);

  const data = {
    displayName: dto.displayName,
    email:       dto.email,
    password:    hash,
    role:        dto.role ?? "student",
    phone:       null,
    avatar:      "avatar1.png",
    teacherId:   null,
    createdAt:   new Date().toISOString(),
  };

  const docRef = await COLL.add(data);
  return { id: docRef.id, ...data };
}

/* ----------  Perfil & extras ---------- */

export async function getMe(uid: string): Promise<UserDTO> {
  const snap = await COLL.doc(uid).get();
  return { id: uid, ...(snap.data() as any) };
}

export async function updateAvatar(uid: string, { avatar }: UpdateAvatarDTO) {
  if (!ALLOWED_AVATARS.includes(avatar as AvatarKey))
    throw new Error("invalid avatar");

  await COLL.doc(uid).update({ avatar });
  return getMe(uid);
}

export async function changePassword(uid: string, dto: ChangePasswordDTO) {
  const ref = COLL.doc(uid);
  await db.runTransaction(async (t) => {
    const doc = await t.get(ref);
    const hash = doc.data()?.password as string;
    if (!hash || !bcrypt.compareSync(dto.oldPwd, hash))
      throw new Error("wrong password");
    t.update(ref, { password: bcrypt.hashSync(dto.newPwd, 10) });
  });
}

/* ----------  Relaciones profesor/alumno ---------- */

export async function getTeacher(uid: string) {
  const doc = await COLL.doc(uid).get();
  const teacherId = doc.data()?.teacherId;
  if (!teacherId) return null;
  const tDoc = await COLL.doc(teacherId).get();
  return { id: teacherId, ...(tDoc.data() as any) };
}

export async function getStudents(uid: string) {
  const snap = await COLL.where("teacherId", "==", uid).get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}
