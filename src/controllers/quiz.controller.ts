import { Request, Response } from "express";
import * as svc from "../services/quiz.service";
import { createResponse } from "../utils/response.util";
import { CreateQuestionDTO, CreateQuizSetDTO, SubmitQuizDTO, UpdateQuestionDTO, UpdateQuizSetDTO } from "../domain/dtos/quiz.dto";

export class QuizController {
  static async list(req: Request, res: Response) {
    const sets   = await svc.listSets();
    const scores = await svc.userScores(req.userId!);
    res.json(createResponse(true, 200, "ok", { sets, scores }));
  }

  static async questions(req: Request, res: Response) {
    const data = await svc.getQuestions(req.params.id);
    //const sanitized = data.map(({ answer, ...rest }) => rest); // 👈 se oculta
    res.json(createResponse(true, 200, "ok", data));
  }

  static async submit(req: Request, res: Response) {
    try {
      const result = await svc.submit(req.userId!, req.body as SubmitQuizDTO);
      res.json(createResponse(true, 200, "submitted", result));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, e.message));
    }
  }

  static async createSet(req: Request, res: Response) {
    const data = await svc.createSet(req.body as CreateQuizSetDTO);
    res.status(201).json(createResponse(true, 201, "created", { set: data }));
  }

  static async updateSet(req: Request, res: Response) {
    const data = await svc.updateSet(req.params.id, req.body as UpdateQuizSetDTO);
    if (!data)
      return res.status(404).json(createResponse(false, 404, "Not found"));
    res.json(createResponse(true, 200, "updated", { set: data }));
  }

  static async deleteSet(req: Request, res: Response) {
    await svc.deleteSet(req.params.id);
    res.sendStatus(204);
  }

  /* ——— CRUD de preguntas ——— */
  static async addQuestion(req: Request, res: Response) {
    const q = await svc.addQuestion(
      req.params.id,
      req.body as CreateQuestionDTO,
    );
    res.status(201).json(createResponse(true, 201, "created", { question: q }));
  }

  static async updateQuestion(req: Request, res: Response) {
    await svc.updateQuestion(
      req.params.id,
      req.params.qid,
      req.body as UpdateQuestionDTO,
    );
    res.sendStatus(204);
  }

  static async deleteQuestion(req: Request, res: Response) {
    await svc.deleteQuestion(req.params.id, req.params.qid);
    res.sendStatus(204);
  }
}
