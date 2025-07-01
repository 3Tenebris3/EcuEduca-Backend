import bcrypt from "bcryptjs";
import { db } from "../config/firebaseAdmin";
import {
  AvatarKey, ALLOWED_AVATARS, ChangePasswordDTO, CreateUserDTO,
  UpdateAvatarDTO, UpdateUserDTO, UserDTO, UserRole,
} from "../domain/dtos/user.dto";
import { RegisterDTO } from "../domain/dtos/auth.dto";

const COLL = db.collection("users");

/* ══════════════════  helpers AUTH (login / register) ══════════════════ */
export async function findByEmail(email: string) {
  const snap = await COLL.where("email", "==", email).limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...(snap.docs[0].data() as any) };
}

export async function createUser(dto: RegisterDTO) {
  const exists = await findByEmail(dto.email);
  if (exists) throw new Error("Email already in use");

  const hash = bcrypt.hashSync(dto.password, 10);
  const data = {
    displayName: dto.displayName,
    email: dto.email,
    password: hash,
    role: dto.role ?? "teacher",
    phone: null,
    avatar: "avatar1.png",
    teacherId: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const ref = await COLL.add(data);
  return { id: ref.id, ...data };
}

/* ══════════════════  Perfil alumno / profesor  ══════════════════ */
export async function getMe(uid: string): Promise<UserDTO> {
  const doc = await COLL.doc(uid).get();
  return { id: uid, ...(doc.data() as any) };
}

export async function updateAvatar(uid: string, { avatar }: UpdateAvatarDTO) {
  if (!ALLOWED_AVATARS.includes(avatar as AvatarKey))
    throw new Error("invalid avatar");
  await COLL.doc(uid).update({ avatar, updatedAt: new Date().toISOString() });
  return getMe(uid);
}

export async function changePassword(uid: string, dto: ChangePasswordDTO) {
  const ref = COLL.doc(uid);
  await db.runTransaction(async (t) => {
    const doc = await t.get(ref);
    const hash = doc.data()?.password as string;
    if (!hash || !bcrypt.compareSync(dto.oldPwd, hash))
      throw new Error("wrong password");
    t.update(ref, {
      password: bcrypt.hashSync(dto.newPwd, 10),
      updatedAt: new Date().toISOString(),
    });
  });
}

/* ══════════════════  relaciones prof-alumno  ══════════════════ */
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
export async function assignTeacher(studentId: string, teacherId: string) {
  await COLL.doc(studentId).update({
    teacherId,
    updatedAt: new Date().toISOString(),
  });
  return getMe(studentId);
}

/* ══════════════════  CRUD para admins  ══════════════════ */
export async function listAll(): Promise<UserDTO[]> {
  const snap = await COLL.get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}
export async function listByRole(role: UserRole) {
  const snap = await COLL.where("role", "==", role).get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}
export async function getById(id: string) {
  const doc = await COLL.doc(id).get();
  return doc.exists ? ({ id, ...(doc.data() as any) } as UserDTO) : null;
}
export async function createByAdmin(dto: CreateUserDTO) {
  const hash = bcrypt.hashSync(dto.password, 10);
  const ref  = COLL.doc();
  const data = {
    ...dto,
    id: ref.id,
    roles: [dto.role ?? "student"],
    password: hash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await ref.set(data);
  return data as UserDTO;
}
export async function updateByAdmin(id: string, dto: UpdateUserDTO) {
  await COLL.doc(id).update({ ...dto, updatedAt: new Date().toISOString() });
  return getById(id);
}
export async function removeByAdmin(id: string) {
  await COLL.doc(id).delete();
}
