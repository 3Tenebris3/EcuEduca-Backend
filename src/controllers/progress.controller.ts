/* src/controllers/progress.controller.ts */
import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { ProgressService } from "../services/progress.service";

export class ProgressController {
  static async saveScenario(req: Request, res: Response) {
    const uid = (req as any).userId;
    await ProgressService.saveScenario(uid, req.body);
    res.json(createResponse(true, 200, "saved"));
  }

  static async saveMinigame(req: Request, res: Response) {
    const uid = (req as any).userId;
    await ProgressService.saveMinigame(uid, req.body);
    res.json(createResponse(true, 200, "saved"));
  }
}