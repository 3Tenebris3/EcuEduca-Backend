import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import {
  QPSubmitDTO,
} from "../domain/dtos/quickpick.dto";
import { QuickPickService } from "../services/quickpick.service";

export class QuickPickController {
  /* ----- GET /sets/:id ----- */
  static async getTheme(req: Request, res: Response) {
    const { id } = req.params;
    const theme = await QuickPickService.getTheme(id);
    if (!theme) {
      return res
        .status(404)
        .json(createResponse(false, 404, "Set not found", null));
    }
    res.json(theme); // respuesta “plana” (sin envoltorio) para ahorrar ancho de banda
  }

  /* ----- POST /submit (JWT) ----- */
  static async submit(req: Request, res: Response) {
    const userId = (req as any).userId as string;          // jwtAuthMiddleware
    const dto = req.body as QPSubmitDTO;

    if (!dto.setId || dto.hits === undefined || dto.misses === undefined) {
      return res
        .status(400)
        .json(createResponse(false, 400, "Bad request", null));
    }

    const data = await QuickPickService.submit(userId, dto);
    res.json(createResponse(true, 200, "Score saved", data));
  }
}
