import { Request, Response } from "express";
import { createResponse }    from "../utils/response.util";
import { TriviaService }     from "../services/trivia.service";
import {
  TriviaSubmitDTO,
  CreateTriviaSetDTO, UpdateTriviaSetDTO,
  CreateQuestionDTO,  UpdateQuestionDTO,
} from "../domain/dtos/trivia.dto";

export class TriviaController {
  /* ---------- alumno ---------- */
  static async list(req: Request, res: Response) {
    const data = await TriviaService.listForUser(req.userId!);
    res.json(createResponse(true, 200, "ok", { data }));
  }

  static async getSet(req: Request, res: Response) {
    const set = await TriviaService.getSet(req.params.id);
    if (!set)
      return res.status(404).json(createResponse(false, 404, "Not found"));
    res.json(createResponse(true, 200, "ok", { set }));
  }

  static async submit(req: Request, res: Response) {
    const dto = req.body as TriviaSubmitDTO;
    const data = await TriviaService.submit(req.userId!, dto);
    res.json(createResponse(true, 200, "saved", data));
  }

  /* ---------- admin ---------- */
  static async createSet(req: Request, res: Response) {
    const set = await TriviaService.createSet(req.body as CreateTriviaSetDTO);
    res.status(201).json(createResponse(true, 201, "created", { set }));
  }

  static async patchSet(req: Request, res: Response) {
    const set = await TriviaService.updateSet(
      req.params.id,
      req.body as UpdateTriviaSetDTO,
    );
    res.json(createResponse(true, 200, "updated", { set }));
  }

  static async deleteSet(req: Request, res: Response) {
    await TriviaService.deleteSet(req.params.id);
    res.sendStatus(204);
  }

  /* —— Preguntas —— */

  static async addQuestion(req: Request, res: Response) {
    const set = await TriviaService.addQuestion(
      req.params.id,
      req.body as CreateQuestionDTO,
    );
    res.json(createResponse(true, 200, "added", { set }));
  }

  static async patchQuestion(req: Request, res: Response) {
    await TriviaService.updateQuestion(
      req.params.id,
      req.params.qid,
      req.body as UpdateQuestionDTO,
    );
    res.sendStatus(204);
  }

  static async deleteQuestion(req: Request, res: Response) {
    await TriviaService.deleteQuestion(req.params.id, req.params.qid);
    res.sendStatus(204);
  }
}
