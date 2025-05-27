import { Request, Response } from "express";
import * as svc from "../services/scene.service";
import {
  CreateSceneDTO,
  UpdateSceneDTO,
} from "../domain/dtos/scene.dto";
import { createResponse } from "../utils/response.util";

export class SceneController {
  /* ---------- alumno ---------- */
  static async list(req: Request, res: Response) {
    const scenes = await svc.list(req.userId!);
    res.json(createResponse(true, 200, "ok", { scenes }));
  }

  static async get(req: Request, res: Response) {
    try {
      const data = await svc.get(req.params.id);
      res.json(createResponse(true, 200, "ok", data));
    } catch {
      res.status(404).json(createResponse(false, 404, "Not found"));
    }
  }

  static async done(req: Request, res: Response) {
    await svc.markDone(req.params.id, req.userId!);
    res.json(createResponse(true, 200, "marked"));
  }

  /* ---------- admin ---------- */
  static async create(req: Request, res: Response) {
    try {
      const data = await svc.create(req.body as CreateSceneDTO);
      res
        .status(201)
        .json(createResponse(true, 201, "created", { scene: data }));
    } catch (e: any) {
      res
        .status(400)
        .json(createResponse(false, 400, e.message, null, { details: e.message }));
    }
  }

  static async patch(req: Request, res: Response) {
    await svc.update(req.params.id, req.body as UpdateSceneDTO);
    res.sendStatus(204);
  }

  static async remove(req: Request, res: Response) {
    await svc.remove(req.params.id);
    res.sendStatus(204);
  }
}
