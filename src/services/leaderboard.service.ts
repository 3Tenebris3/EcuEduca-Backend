import { db } from "../config/firebaseAdmin";
import { LeaderboardRowDTO } from "../domain/dtos/leaderboard.dto";

const COLL = db.collection("leaderboard").doc("global").collection("rows");

export async function getTop(n = 100): Promise<LeaderboardRowDTO[]> {
  const snap = await COLL.orderBy("points", "desc").limit(n).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeaderboardRowDTO));
}

export async function addPoints(
  uid: string,
  delta: number,
  name: string,
  avatar: string
): Promise<void> {
  const ref = COLL.doc(uid);
  await db.runTransaction(async (t) => {
    const doc = await t.get(ref);
    const current = doc.exists ? (doc.data()?.points as number) || 0 : 0;
    t.set(
      ref,
      { name, avatar, points: current + delta },
      { merge: true }
    );
  });
}
