import { db, admin } from "../config/firebaseAdmin";
import {
  MemoryPairResponse,
  SubmitMemoryDTO,
} from "../domain/dtos/memory.dto";

/* Colecciones */
const ROOT   = db.collection("minigames").doc("memory");
const SETS   = ROOT.collection("sets");
const SCORES = (uid: string) => db.collection("scores").doc(uid).collection("memory");

/* ------------- list sets ------------- */
export async function listSets() {
  const snap = await SETS.get();
  return snap.docs.map((d) => ({
    id:    d.id,
    title: d.data().title,
    total: d.data().total,
  }));
}

/* ------------- usuario → mapa de scores ------------- */
export async function userScores(uid: string) {
  const snap = await SCORES(uid).get();
  const out: Record<string, { moves: number; pairs: number }> = {};
  snap.docs.forEach((d) => (out[d.id] = d.data() as any));
  return out;
}

/* ------------- pares de un set ------------- */
export async function getPairs(setId: string): Promise<MemoryPairResponse[]> {
  const snap = await SETS.doc(setId).collection("pairs").get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

/* ------------- submit resultado ------------- */
export async function submit(uid: string, dto: SubmitMemoryDTO) {
  /* total de parejas → para guardar junto al score */
  const setDoc = await SETS.doc(dto.setId).get();
  if (!setDoc.exists) throw new Error("set_not_found");

  const pairs = setDoc.data()!.total as number;

  /* puntos: 40 – movimientos (mínimo 0) */
  const gained = Math.max(0, 40 - dto.moves);

  await db.runTransaction(async (t) => {
    t.set(SCORES(uid).doc(dto.setId), { moves: dto.moves, pairs });

    /* incrementa puntos del usuario */
    const userRef = db.collection("users").doc(uid);
    t.update(userRef, {
      points: admin.firestore.FieldValue.increment(gained),
    });
  });

  return { gained };
}
