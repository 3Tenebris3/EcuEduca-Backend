import { firestore } from "firebase-admin";
import { LeaderboardRow } from "../domain/dtos/leaderboard.dto";

// src/services/leaderboard.service.ts
export async function getRankingForTeacher(teacherId: string, limit = 20) {
    /* 
       Supongamos que cada documento "scores/{uid}" tiene:
         - totalPoints (number)
         - teacherId
    */
    const col = firestore().collection("scores");
    const snap = await col
      .where("teacherId", "==", teacherId)
      .orderBy("totalPoints", "desc")
      .limit(limit)
      .get();
  
    const rows: LeaderboardRow[] = [];
    let rank = 1;
    for (const doc of snap.docs) {
      const { totalPoints, avatar, name } = doc.data();
      rows.push({ id: doc.id, avatar, name, points: totalPoints, rank: rank++ });
    }
    return rows;
  }
  