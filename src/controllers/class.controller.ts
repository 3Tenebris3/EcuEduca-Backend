import { Request, Response } from "express";
import * as svc from "../services/class.service";
import { createResponse } from "../utils/response.util";
import {
  CreateClassDTO,
  UpdateClassDTO,
  EnrollDTO,
} from "../domain/dtos/class.dto";

/* ───────────────────────────────────────────── */

export class ClassController {
  /* -------- Admin CRUD -------- */
  static async list(_req: Request, res: Response) {
    const classes = await svc.listAll();
    res.json(createResponse(true, 200, "ok", { classes }));
  }

  static async get(req: Request, res: Response) {
    const cls = await svc.getById(req.params.id);
    if (!cls)
      return res.status(404).json(createResponse(false, 404, "Not found"));
    res.json(createResponse(true, 200, "ok", { cls }));
  }

  static async create(req: Request, res: Response) {
    const cls = await svc.create(req.body as CreateClassDTO);
    res.status(201).json(createResponse(true, 201, "created", { cls }));
  }

  static async update(req: Request, res: Response) {
    const cls = await svc.update(req.params.id, req.body as UpdateClassDTO);
    res.json(createResponse(true, 200, "updated", { cls }));
  }

  static async remove(req: Request, res: Response) {
    await svc.remove(req.params.id);
    res.json(createResponse(true, 200, "deleted"));
  }

  /* -------- Enroll / Un-enroll (Admin) -------- */
  static async enroll(req: Request, res: Response) {
    try {
      await svc.enrollStudent(req.body as EnrollDTO);
      res.sendStatus(204);
    } catch (e: any) {
      res
        .status(400)
        .json(createResponse(false, 400, e.message ?? "error"));
    }
  }

  /* -------- (Opcional) listado clases del profesor -------- */
  static async listForTeacher(req: Request, res: Response) {
    const classes = await svc.forTeacher(req.userId!);
    res.json(createResponse(true, 200, "ok", { classes }));
  }
}
