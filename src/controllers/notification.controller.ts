// src/controllers/notification.controller.ts
import { Request, Response } from "express";
import * as svc from "../services/notification.service";
import { createResponse } from "../utils/response.util";
import { CreateNotificationDTO } from "../domain/dtos/notification.dto";

export class NotificationController {
  static async list(req: Request, res: Response) {
    const rows = await svc.listByUser(req.userId!);
    res.json(createResponse(true, 200, "ok", rows));
  }

  static async create(req: Request, res: Response) {
    const dto = req.body as CreateNotificationDTO;
    try {
      const { id } = await svc.create(dto);
      res.status(201).json(createResponse(true, 201, "created", { id }));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, e.message));
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      await svc.remove(req.userId!, req.params.id);
      res.sendStatus(204);
    } catch {
      res.status(403).json(createResponse(false, 403, "forbidden"));
    }
  }
}
