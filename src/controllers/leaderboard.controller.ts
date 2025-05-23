import { Request, Response } from "express";
import * as service from "../services/leaderboard.service";

export async function getLeaderboard(req: Request, res: Response) {
  const rows = await service.getTopN(100);
  // agrega el campo rank en memoria:
  const ordered = rows.map((r, idx) => ({ ...r, rank: idx + 1 }));
  res.json(ordered);
}
