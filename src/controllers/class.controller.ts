import { Request, Response } from 'express';
import { createResponse }    from '../utils/response.util';
import { ClassService }      from '../services/class.service';
import { CreateClassDTO, UpdateClassDTO } from '../domain/dtos/class.dto';

export class ClassController {

  /**
   * @openapi
   * /classes:
   *   post:
   *     summary: Crea una nueva clase
   *     tags: [Clases]
   *     security: [ bearerAuth: [] ]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/CreateClassDTO' }
   *     responses:
   *       201: { description: Clase creada }
   */
  static async create(req: Request, res: Response) {
    try {
      const dto = req.body as CreateClassDTO;
      const createdBy = (req as any).userId;
      const doc = await ClassService.create({ ...dto, createdBy });
      res.status(201).json(createResponse(true, 201, 'Class created', doc));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, 'Error', null, { details: e.message }));
    }
  }

  /** Listar todas */
  static async getAll(_: Request, res: Response) {
    const list = await ClassService.getAll();
    res.json(createResponse(true, 200, 'OK', list));
  }

  /** Detalle por ID */
  static async getById(req: Request, res: Response) {
    const doc = await ClassService.getById(req.params.classId);
    doc
      ? res.json(createResponse(true, 200, 'OK', doc))
      : res.status(404).json(createResponse(false, 404, 'Not found'));
  }

  /** Actualizar */
  static async update(req: Request, res: Response) {
    const doc = await ClassService.update(
      req.params.classId,
      req.body as UpdateClassDTO
    );
    res.json(createResponse(true, 200, 'Updated', doc));
  }

  /** Eliminar */
  static async delete(req: Request, res: Response) {
    await ClassService.delete(req.params.classId);
    res.json(createResponse(true, 200, 'Deleted'));
  }
}
