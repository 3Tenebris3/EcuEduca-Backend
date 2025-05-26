import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { TriviaService } from "../services/trivia.service";
import { TriviaSubmitDTO } from "../domain/dtos/trivia.dto";

export class TriviaController {
  static async list(req: Request, res: Response) {
    const userId = (req as any).userId as string;
    const data   = await TriviaService.listForUser(userId);
    res.json(data);
  }

  static async getSet(req: Request, res: Response) {
    const { id } = req.params;
    const set = await TriviaService.getSet(id);
    if (!set) return res.status(404).json(createResponse(false, 404, "Not found"));
    res.json(set);
  }

  static async submit(req: Request, res: Response) {
    const userId = (req as any).userId as string;
    const dto = req.body as TriviaSubmitDTO;
    if (!dto.setId) return res.status(400).json(createResponse(false, 400, "Bad request"));
    const data = await TriviaService.submit(userId, dto);
    res.json(createResponse(true, 200, "Saved", data));
  }
}
