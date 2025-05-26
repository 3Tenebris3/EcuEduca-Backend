import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { SequenceService } from "../services/sequence.service";
import { SeqSubmitDTO } from "../domain/dtos/sequence.dto";

export class SequenceController {
  static async getSet(req: Request, res: Response) {
    const { id } = req.params;
    const set = await SequenceService.getSet(id);
    if (!set) {
      return res
        .status(404)
        .json(createResponse(false, 404, "Set not found", null));
    }
    res.json(set); // sin envoltorio
  }

  static async submit(req: Request, res: Response) {
    const userId = (req as any).userId as string;
    const dto = req.body as SeqSubmitDTO;

    if (!dto.setId || dto.correct == null || dto.total == null) {
      return res
        .status(400)
        .json(createResponse(false, 400, "Bad request", null));
    }

    const data = await SequenceService.submit(userId, dto);
    res.json(createResponse(true, 200, "Score saved", data));
  }

  /* (nuevo) GET /sets -------------- */
  static async list(req: Request, res: Response) {
    const userId = (req as any).userId as string;
    const data   = await SequenceService.listForUser(userId);
    res.json(data);          // arreglo de SeqSetSummaryDTO
  }

}
