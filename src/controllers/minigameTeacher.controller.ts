import { Request, Response } from "express";
import {
  listTeacherMinigames,
  getMinigameDetail,
} from "../services/minigameTeacher.service";
import { createResponse } from "../utils/response.util";

export class TeacherMinigameController {
  static async list(req: Request, res: Response) {
    const teacherId = (req as any).userId;
    const { classId } = req.query;
    const data = await listTeacherMinigames(
      teacherId,
      typeof classId === "string" ? classId : undefined,
    );
    res.json(createResponse(true, 200, "ok", { minigames: data }));
  }

  static async detail(req: Request, res: Response) {
    const teacherId = (req as any).userId;
    const { classId } = req.query;
    const { id } = req.params;

    if (!classId || typeof classId !== "string") {
      return res
        .status(400)
        .json(createResponse(false, 400, "classId required", null));
    }

    // opcional: validar que la clase sea del profe
    const data = await getMinigameDetail(id, classId);
    res.json(createResponse(true, 200, "ok", data));
  }
}
