import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { PointService } from "../services/point.service";
import { AdjustPointsDTO } from "../domain/dtos/points.dto";

export class TeacherPointsController {

  /* GET /teacher/points?classId=123 */
  static async list(req: Request, res: Response) {
    try {
      const classId = req.query.classId as string;
      if (!classId) throw new Error("classId required");

      const rows = await PointService.listByClass(classId);
      res.json(createResponse(true, 200, "ok", rows));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, "error", null, { details: e.message }));
    }
  }

  /* POST /teacher/points/adjust */
  static async adjust(req: Request, res: Response) {
    try {
      const dto = req.body as AdjustPointsDTO;
      const newTotal = await PointService.adjust(dto, (req as any).userId);
      res.json(createResponse(true, 200, "adjusted", { points: newTotal }));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, "error", null, { details: e.message }));
    }
  }
}
