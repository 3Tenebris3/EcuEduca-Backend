import { db } from "../config/firebaseAdmin";
import { LeaderboardRowDTO } from "../domain/dtos/leaderboard.dto";

const COLL = db.collection("leaderboard").doc("global").collection("rows");

export async function getTopN(n = 100): Promise<LeaderboardRowDTO[]> {
  const snap = await COLL.orderBy("points", "desc").limit(n).get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<LeaderboardRowDTO, "id">) }));
}

export async function updateUserPoints(
  uid: string,
  delta: number,
  name: string,
  avatar: string
) {
  const ref = COLL.doc(uid);
  await db.runTransaction(async (t) => {
    const doc = await t.get(ref);
    const prev = doc.exists ? doc.data()?.points || 0 : 0;
    t.set(
      ref,
      { name, avatar, points: prev + delta },
      { merge: true }
    );
  });
}
