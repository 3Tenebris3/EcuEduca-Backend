/* src/controllers/teacher.controller.ts */
import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { ProgressService } from "../services/progress.service";
import { db } from "../config/firebaseAdmin";

export class TeacherController {
  // claseId viene del propio usuario (o del path, según prefieras)
  static async scenarioSummary(req: Request, res: Response) {
    const classId = (req as any).classId;
    const data = await ProgressService.scenarioSummary(classId);
    res.json(createResponse(true, 200, "ok", data));
  }

  static async minigameSummary(req: Request, res: Response) {
    const classId = (req as any).classId;
    const data = await ProgressService.minigameSummary(classId);
    res.json(createResponse(true, 200, "ok", data));
  }

  static async pointsSummary(req: Request, res: Response) {
    const classId = (req as any).classId;
    const users = await db
      .collection("users")
      .where("classId", "==", classId)
      .get();

    const list = users.docs.map((d) => {
      const { displayName, points, rewardsClaimed } = d.data() as any;
      return { id: d.id, displayName, points, rewardsClaimed };
    });

    res.json(createResponse(true, 200, "ok", { students: list }));
  }
}
