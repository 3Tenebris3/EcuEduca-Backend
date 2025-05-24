import { Request, Response } from "express";
import * as svc from "../services/reward.service";
import { createResponse } from "../utils/response.util";

export class RewardController {
  static async list(req: Request, res: Response) {
    const defs    = await svc.listDefinitions();
    const claimed = await svc.listClaimed(req.userId!);
    res.json(createResponse(true, 200, "ok", { defs, claimed }));
  }

  static async redeem(req: Request, res: Response) {
    try {
      await svc.redeem(req.userId!, req.body.rewardId);
      res.sendStatus(204);
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, e.message));
    }
  }
}
