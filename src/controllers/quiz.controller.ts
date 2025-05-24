import { Request, Response } from "express";
import * as svc from "../services/quiz.service";
import { createResponse } from "../utils/response.util";
import { SubmitQuizDTO } from "../domain/dtos/quiz.dto";

export class QuizController {
  static async list(req: Request, res: Response) {
    const sets   = await svc.listSets();
    const scores = await svc.userScores(req.userId!);
    res.json(createResponse(true, 200, "ok", { sets, scores }));
  }

  static async questions(req: Request, res: Response) {
    const data = await svc.getQuestions(req.params.id);
    /* NO enviar el campo answer al cliente */
    const sanitized = data.map(({ answer, ...rest }) => rest);
    res.json(createResponse(true, 200, "ok", sanitized));
  }

  static async submit(req: Request, res: Response) {
    try {
      const result = await svc.submit(req.userId!, req.body as SubmitQuizDTO);
      res.json(createResponse(true, 200, "submitted", result));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, e.message));
    }
  }
}
