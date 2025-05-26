import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import * as svc from "../services/memory.service";
import { SubmitMemoryDTO } from "../domain/dtos/memory.dto";

export class MemoryController {
  /* GET /minigames/memory/sets */
  static async list(req: Request, res: Response) {
    const sets   = await svc.listSets();
    const scores = await svc.userScores(req.userId!);
    res.json(createResponse(true, 200, "ok", { sets, scores }));
  }

  /* GET /minigames/memory/sets/:id */
  static async pairs(req: Request, res: Response) {
    const data = await svc.getPairs(req.params.id);
    res.json(createResponse(true, 200, "ok", data));
  }

  /* POST /minigames/memory/submit */
  static async submit(req: Request, res: Response) {
    try {
      const result = await svc.submit(req.userId!, req.body as SubmitMemoryDTO);
      res.json(createResponse(true, 200, "submitted", result));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, e.message));
    }
  }
}
