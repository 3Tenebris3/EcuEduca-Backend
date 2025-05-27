import { db } from "../config/firebaseAdmin";
import {
  SceneMetaDTO,
  CreateSceneDTO,
  UpdateSceneDTO,
} from "../domain/dtos/scene.dto";

const SCENES       = db.collection("scenarios");
const USER_SCENES  = (uid: string) =>
  db.collection("users").doc(uid).collection("doneScenes");

/* ---------- alumno ---------- */
export async function list(uid: string): Promise<SceneMetaDTO[]> {
  const [all, doneSnap] = await Promise.all([
    SCENES.get(),
    USER_SCENES(uid).get(),
  ]);

  const done = new Set(doneSnap.docs.map((d) => d.id));

  return all.docs.map((d) => ({
    id:        d.id,
    title:     d.data().title,
    preview:   d.data().preview,
    completed: done.has(d.id),
  }));
}

export async function get(id: string) {
  const doc = await SCENES.doc(id).get();
  if (!doc.exists) throw new Error("Scene not found");
  return doc.data();
}

export async function markDone(sceneId: string, uid: string) {
  await USER_SCENES(uid).doc(sceneId).set({ at: new Date() });
}

/* ---------- admin ---------- */
export async function create(dto: CreateSceneDTO) {
  const ref = SCENES.doc(dto.id);
  const exists = await ref.get();
  if (exists.exists) throw new Error("ID already used");
  await ref.set(dto);
  return dto;
}

export async function update(id: string, dto: UpdateSceneDTO) {
  await SCENES.doc(id).update(dto);
}

export async function remove(id: string) {
  await SCENES.doc(id).delete();
}
