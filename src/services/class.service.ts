import { db } from "../config/firebaseAdmin";
import { ClassDTO } from "../domain/dtos/class.dto";

export class ClassService {
  /** Todas las clases que enseña el profesor */
  static async forTeacher(teacherId: string): Promise<ClassDTO[]> {
    const snap = await db.collection("classes")
      .where("teacherId", "==", teacherId)
      .get();

    return snap.docs.map(d => {
      const data = d.data();
      return {
        id:    d.id,
        name:  data.name,
        grade: data.grade ?? "",
      } as ClassDTO;
    });
  }
}
/**  Modelo ultra-ligero que usaremos en el dashboard */
export interface StudentMini {
  id:          string;
  displayName: string;
  email:       string;
}

/* -------------------------------------------------------------------------- */
/*  ⬇️  NUEVA FUNCIÓN                                                         */
/* -------------------------------------------------------------------------- */
export async function getClassStudents(classId: string): Promise<StudentMini[]> {
  /**
   *  suponemos que cada documento de user tiene:
   *     - roles:   string[]
   *     - classes: string[]   (ids de las clases en las que está)
   */
  const snap = await db
    .collection("users")
    .where("roles", "array-contains", "student")
    .where("classes", "array-contains", classId)
    .get();

  return snap.docs.map(
    (d) =>
      ({
        id: d.id,
        displayName: d.data().displayName ?? "—",
        email: d.data().email,
      } as StudentMini),
  );
}

/* -------------------------------------------------------------------------- */
/*  (ya existente) obtener las clases del profesor                            */
/* -------------------------------------------------------------------------- */
export async function getClasses(teacherId: string) {
  const snap = await db
    .collection("classes")
    .where("teacherId", "==", teacherId)
    .get();

  return snap.docs.map((d) => ({
    id:   d.id,
    name: d.data().name as string,
  }));
}
