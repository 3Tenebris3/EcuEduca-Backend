import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import * as svc from "../services/fillblank.service";
import { SubmitFBDTO } from "../domain/dtos/fillblank.dto";

export class FillBlankController {
  /** GET /minigames/fillblank/sets/:id */
  static async questions(req: Request, res: Response) {
    const data = await svc.getQuestions(req.params.id);
    /* enviamos la respuesta correcta también; el front la usa para feedback */
    res.json(createResponse(true, 200, "ok", data));
  }

  /** POST /minigames/fillblank/submit */
  static async submit(req: Request, res: Response) {
    try {
      const result = await svc.submit(req.userId!, req.body as SubmitFBDTO);
      res.json(createResponse(true, 200, "submitted", result));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, e.message));
    }
  }

  static async list(req: Request, res: Response) {
    const sets = await svc.listSets();
    const scores = await svc.userScores(req.userId!);
    res.json(createResponse(true, 200, "ok", { sets, scores }));
  }
}
