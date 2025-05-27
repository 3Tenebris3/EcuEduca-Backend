import { db } from "../config/firebaseAdmin";
import {
  ClassDTO,
  CreateClassDTO,
  UpdateClassDTO,
  EnrollDTO,
} from "../domain/dtos/class.dto";

const COLL = db.collection("classes");
const USERS = db.collection("users");

/* ───────── ADMIN CRUD ───────── */

export async function listAll(): Promise<ClassDTO[]> {
  const classesSnap = await COLL.get();

  // añadimos studentsCount con una pequeña consulta por clase
  const result: ClassDTO[] = await Promise.all(
    classesSnap.docs.map(async (d) => {
      const data = d.data();
      const stuSnap = await USERS
        .where("classes", "array-contains", d.id)
        .get();

      return {
        id:           d.id,
        name:         data.name,
        grade:        data.grade ?? "",
        teacherId:    data.teacherId ?? "",
        studentsCount: stuSnap.size,          // 👈
      };
    }),
  );

  return result;
}

export async function getById(id: string): Promise<ClassDTO | null> {
  const doc = await COLL.doc(id).get();
  return doc.exists ? ({ id, ...(doc.data() as any) } as ClassDTO) : null;
}

export async function create(dto: CreateClassDTO): Promise<ClassDTO> {
  const ref = await COLL.add(dto);
  return { id: ref.id, ...dto };
}

export async function update(id: string, dto: UpdateClassDTO): Promise<ClassDTO> {
  await COLL.doc(id).update(dto);
  const doc = await COLL.doc(id).get();
  return { id, ...(doc.data() as any) } as ClassDTO;
}

export async function remove(id: string) {
  await COLL.doc(id).delete();
}

/* ───────── Relaciones profesor ⇄ clases ───────── */

export async function forTeacher(teacherId: string): Promise<ClassDTO[]> {
  const snap = await COLL.where("teacherId", "==", teacherId).get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }) as ClassDTO);
}

/* ───────── Matriculación estudiante ───────── */

export async function enrollStudent({ studentId, classId, action }: EnrollDTO) {
  const userRef = USERS.doc(studentId);
  await db.runTransaction(async t => {
    const u = await t.get(userRef);
    if (!u.exists) throw new Error("student not found");

    const current: string[] = u.data()?.classes ?? [];
    const next =
      action === "add"
        ? Array.from(new Set([...current, classId]))
        : current.filter(c => c !== classId);

    t.update(userRef, { classes: next });
  });
}


export interface StudentMini {
  id:          string;
  displayName: string;
  email:       string;
}

/* -------------------------------------------------------------------------- */
/*  🔹  ALUMNOS DE UNA CLASE                                                  */
/* -------------------------------------------------------------------------- */
export async function getClassStudents(classId: string): Promise<StudentMini[]> {

  const snap = await USERS
    .where("role", "==", "student")                 // ←  campo simple
    .where("classes", "array-contains", classId)    // ←  único array-contains
    .get();

  return snap.docs.map(d => ({
    id:          d.id,
    displayName: d.data().displayName ?? "—",
    email:       d.data().email ?? "—",
  }));
}