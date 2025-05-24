import { db } from "../config/firebaseAdmin";

const DEF_COLL   = db.collection("rewards").doc("definitions").collection("items");
const CLAIM_COLL = (uid: string) =>
  db.collection("rewards").doc("claimed").collection(uid);

export async function listDefinitions() {
  const snap = await DEF_COLL.get();
  return snap.docs.map((d) => d.data());
}

export async function listClaimed(uid: string) {
  const snap = await CLAIM_COLL(uid).get();
  return snap.docs.map((d) => d.id);
}

export async function redeem(uid: string, rewardId: string) {
  const rewardDoc = await DEF_COLL.doc(rewardId).get();
  if (!rewardDoc.exists) throw new Error("reward_not_found");
  const { threshold } = rewardDoc.data()!;

  await db.runTransaction(async (t) => {
    const userRef = db.collection("users").doc(uid);
    const user    = await t.get(userRef);
    const pts     = user.data()!.points || 0;
    if (pts < threshold) throw new Error("not_enough_points");

    const claimRef = CLAIM_COLL(uid).doc(rewardId);
    t.set(claimRef, { date: new Date().toISOString() });
    t.update(userRef, { points: pts - threshold });
  });
}
