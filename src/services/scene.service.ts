import { db } from "../config/firebaseAdmin";
import { CreateSceneDTO, SceneMetaDTO } from "../domain/dtos/scene.dto";

const SCENES = db.collection("scenarios");
const USER_SCENES = (uid: string) =>
  db.collection("users").doc(uid).collection("doneScenes");

export class SceneService {
  /* ---------- lista con flag de completado ---------- */
  static async list(uid: string): Promise<SceneMetaDTO[]> {
    const [sc, doneSnap] = await Promise.all([
      SCENES.get(),
      USER_SCENES(uid).get(),
    ]);

    const doneIds = new Set(doneSnap.docs.map(d => d.id));

    return sc.docs.map(d => {
      const { title, preview } = d.data();
      return {
        id: d.id,
        title,
        preview,
        completed: doneIds.has(d.id),
      } as SceneMetaDTO;
    });
  }

  /* ---------- detalle ---------- */
  static async get(id: string) {
    const snap = await SCENES.doc(id).get();
    if (!snap.exists) throw new Error("Scene not found");
    return snap.data();
  }

  /* ---------- marcar como completada ---------- */
  static async markDone(id: string, uid: string) {
    await USER_SCENES(uid).doc(id).set({ at: new Date() });
  }

  /* ---------- crear/editar (admin) ---------- */
  static async upsert(dto: CreateSceneDTO) {
    await SCENES.doc(dto.id).set(dto, { merge:true });
  }
}
