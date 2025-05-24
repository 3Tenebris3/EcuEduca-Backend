import { Request, Response } from "express";
import * as svc from "../services/user.service";
import { createResponse } from "../utils/response.util";
import {
  UpdateAvatarDTO,
  ChangePasswordDTO,
} from "../domain/dtos/user.dto";

export class UserController {
  static async me(req: Request, res: Response) {
    const data = await svc.getMe(req.userId!);
    res.json(createResponse(true, 200, "ok", { user: data }));
  }

  static async avatar(req: Request, res: Response) {
    try {
      const data = await svc.updateAvatar(req.userId!, req.body as UpdateAvatarDTO);
      res.json(createResponse(true, 200, "updated", { user: data }));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, e.message));
    }
  }

  static async changePwd(req: Request, res: Response) {
    try {
      await svc.changePassword(req.userId!, req.body as ChangePasswordDTO);
      res.sendStatus(204);
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, e.message));
    }
  }

  static async myTeacher(req: Request, res: Response) {
    const teacher = await svc.getTeacher(req.userId!);
    res.json(createResponse(true, 200, "ok", { teacher }));
  }

  static async myStudents(req: Request, res: Response) {
    const students = await svc.getStudents(req.userId!);
    res.json(createResponse(true, 200, "ok", { students }));
  }
}
