import { Request, Response } from 'express';
import { createResponse }     from '../utils/response.util';
import { MinigameService }    from '../services/minigame.service';
import { CreateMinigameDTO, UpdateMinigameDTO } from '../domain/dtos/minigame.dto';

export class MinigameController {

  /** POST /minigames */
  static async create(req: Request, res: Response) {
    try {
      const dto = req.body as CreateMinigameDTO;
      const createdBy = (req as any).userId;
      const doc = await MinigameService.create({ ...dto, createdBy });
      res.status(201).json(createResponse(true, 201, 'Minigame created', doc));
    } catch (e:any) {
      res.status(400).json(createResponse(false, 400, 'Error', null, { details: e.message }));
    }
  }

  static async getAll(_: Request, res: Response) {
    res.json(createResponse(true, 200, 'OK', await MinigameService.getAll()));
  }

  static async getById(req: Request, res: Response) {
    const doc = await MinigameService.getById(req.params.minigameId);
    doc
      ? res.json(createResponse(true, 200, 'OK', doc))
      : res.status(404).json(createResponse(false, 404, 'Not found'));
  }

  static async update(req: Request, res: Response) {
    const doc = await MinigameService.update(
      req.params.minigameId,
      req.body as UpdateMinigameDTO
    );
    res.json(createResponse(true, 200, 'Updated', doc));
  }

  static async delete(req: Request, res: Response) {
    await MinigameService.delete(req.params.minigameId);
    res.json(createResponse(true, 200, 'Deleted'));
  }
}
