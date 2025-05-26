import { Request, Response } from "express";
import { ClassService } from "../services/class.service";
import { createResponse } from "../utils/response.util";

export class ClassController {
  static async listForTeacher(req: Request, res: Response) {
    try {
      const teacherId = (req as any).userId;         // viene del JWT
      const classes   = await ClassService.forTeacher(teacherId);
      res.json(createResponse(true, 200, "ok", { classes }));
    } catch (e: any) {
      res.status(400).json(
        createResponse(false, 400, "error", null, { details: e.message }),
      );
    }
  }
}
