import { Request, Response } from "express";
import * as svc from "../services/user.service";
import { createResponse } from "../utils/response.util";
import {
  ChangePasswordDTO,
  UpdateAvatarDTO,
  CreateUserDTO,
  UpdateUserDTO,
} from "../domain/dtos/user.dto";

export class UserController {
  /* ───────── Perfil propio ───────── */
  static async me(req: Request, res: Response) {
    const user = await svc.getMe(req.userId!);
    res.json(createResponse(true, 200, "ok", { user }));
  }
  static async avatar(req: Request, res: Response) {
    const user = await svc.updateAvatar(req.userId!, req.body as UpdateAvatarDTO);
    res.json(createResponse(true, 200, "avatar updated", { user }));
  }
  static async changePwd(req: Request, res: Response) {
    await svc.changePassword(req.userId!, req.body as ChangePasswordDTO);
    res.sendStatus(204);
  }
  static async myTeacher(req: Request, res: Response) {
    const teacher = await svc.getTeacher(req.userId!);
    res.json(createResponse(true, 200, "ok", { teacher }));
  }
  static async myStudents(req: Request, res: Response) {
    const students = await svc.getStudents(req.userId!);
    res.json(createResponse(true, 200, "ok", { students }));
  }

  /* ───────── Admin CRUD ───────── */
  static async list(req: Request, res: Response) {
    const users = await svc.listAll();
    res.json(createResponse(true, 200, "ok", { users }));
  }
  static async listByRole(req: Request, res: Response) {
    const users = await svc.listByRole(req.params.role as any);
    res.json(createResponse(true, 200, "ok", { users }));
  }
  static async get(req: Request, res: Response) {
    const user = await svc.getById(req.params.id);
    if (!user) return res.status(404).json(createResponse(false, 404, "Not found"));
    res.json(createResponse(true, 200, "ok", { user }));
  }
  static async create(req: Request, res: Response) {
    const user = await svc.createByAdmin(req.body as CreateUserDTO);
    res.status(201).json(createResponse(true, 201, "created", { user }));
  }
  static async update(req: Request, res: Response) {
    const user = await svc.updateByAdmin(req.params.id, req.body as UpdateUserDTO);
    res.json(createResponse(true, 200, "updated", { user }));
  }
  static async remove(req: Request, res: Response) {
    await svc.removeByAdmin(req.params.id);
    res.json(createResponse(true, 200, "deleted"));
  }

  /* ───────── Asignar profesor ───────── */
  static async assignTeacher(req: Request, res: Response) {
    const user = await svc.assignTeacher(req.params.id, req.body.teacherId);
    res.json(createResponse(true, 200, "teacher assigned", { user }));
  }
}
