import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { SceneService } from "../services/scene.service";
import { CreateSceneDTO } from "../domain/dtos/scene.dto";

export class SceneController {
  /* GET /scenarios */
  static async list(req: Request, res: Response) {
    const scenes = await SceneService.list((req as any).userId);
    res.json(createResponse(true, 200, "ok", { scenes }));
  }

  /* GET /scenarios/:id */
  static async get(req: Request, res: Response) {
    try {
      const data = await SceneService.get(req.params.id);
      res.json(createResponse(true, 200, "ok", data));
    } catch {
      res.status(404).json(createResponse(false, 404, "Not found"));
    }
  }

  /* POST /scenarios/:id/done */
  static async done(req: Request, res: Response) {
    await SceneService.markDone(req.params.id, (req as any).userId);
    res.json(createResponse(true, 200, "marked"));
  }

  /* POST /scenarios  (admin) */
  static async create(req: Request, res: Response) {
    try {
      await SceneService.upsert(req.body as CreateSceneDTO);
      res.status(201).json(createResponse(true, 201, "created"));
    } catch (e:any) {
      res.status(400).json(createResponse(false,400,"fail",null,{details:e.message}));
    }
  }
}
