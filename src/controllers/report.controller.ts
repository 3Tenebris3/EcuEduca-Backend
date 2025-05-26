import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { ReportService } from "../services/report.service";

export class ReportController {
  static async summary(req: Request, res: Response) {
    try {
      const { classId } = req.query as { classId: string };
      const data = await ReportService.summary(classId);
      res.json(createResponse(true, 200, "ok", { summary: data }));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, "error", null, { details: e.message }));
    }
  }

  static async students(req: Request, res: Response) {
    try {
      const { classId } = req.query as { classId: string };
      const data = await ReportService.students(classId);
      res.json(createResponse(true, 200, "ok", { students: data }));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, "error", null, { details: e.message }));
    }
  }
}
