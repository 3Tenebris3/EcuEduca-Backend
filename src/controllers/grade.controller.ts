import { Request, Response } from 'express';
import { createResponse }    from '../utils/response.util';
import { GradeService }      from '../services/grade.service';
import { CreateGradeDTO, GradeQuery } from '../domain/dtos/grade.dto';

export class GradeController {

  /**
   * @openapi
   * /grades:
   *   post:
   *     summary: Registra una calificación
   *     tags: [Calificaciones]
   *     security: [ bearerAuth: [] ]
   */
  static async create(req: Request, res: Response) {
    try {
      const dto = req.body as CreateGradeDTO;
      const doc = await GradeService.create(dto);
      res.status(201).json(createResponse(true, 201, 'Grade saved', doc));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, 'Error', null, { details: e.message }));
    }
  }

  /**
   * @openapi
   * /grades:
   *   get:
   *     summary: Lista de calificaciones
   *     tags: [Calificaciones]
   *     security: [ bearerAuth: [] ]
   */
  static async list(req: Request, res: Response) {
    const list = await GradeService.list(req.query as GradeQuery);
    res.json(createResponse(true, 200, 'OK', list));
  }
}
