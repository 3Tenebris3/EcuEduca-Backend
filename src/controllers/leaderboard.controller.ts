import { Request, Response } from "express";
import * as LeaderboardSvc from "../services/leaderboard.service";
import { createResponse } from "../utils/response.util";
import { AddPointsDTO } from "../domain/dtos/leaderboard.dto";

export class LeaderboardController {
  static async list(req: Request, res: Response) {
    try {
      const rows = await LeaderboardSvc.getTop(100);
      /* añade rank en memoria sin sobrescribir Firestore */
      const withRank = rows.map((r, i) => ({ ...r, rank: i + 1 }));
      res.json(createResponse(true, 200, "Leaderboard", withRank));
    } catch (e: any) {
      res
        .status(500)
        .json(createResponse(false, 500, "Error", null, { details: e.message }));
    }
  }

  static async addPoints(req: Request, res: Response) {
    const { delta } = req.body as AddPointsDTO;
    if (typeof delta !== "number") {
      return res
        .status(400)
        .json(createResponse(false, 400, "delta must be number"));
    }

    try {
      await LeaderboardSvc.addPoints(
        req.userId!,                     // viene del middleware
        delta,
        req.body.name || "Alumno",       // opcional, mejor pásalo desde front
        req.body.avatar || "avatar1.png"
      );
      res.status(204).send();
    } catch (e: any) {
      res
        .status(500)
        .json(createResponse(false, 500, "Error", null, { details: e.message }));
    }
  }
}
