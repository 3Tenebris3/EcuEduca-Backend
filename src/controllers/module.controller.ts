import { Request, Response } from 'express';
import { createResponse }    from '../utils/response.util';
import { ModuleService }     from '../services/module.service';
import { CreateModuleDTO, UpdateModuleDTO } from '../domain/dtos/module.dto';

export class ModuleController {

  /** POST /classes/:classId/units/:unitId/modules */
  static async create(req: Request, res: Response) {
    try {
      const { classId, unitId } = req.params;
      const dto = req.body as CreateModuleDTO;
      const createdBy = (req as any).userId;
      const doc = await ModuleService.create(classId, unitId, { ...dto, createdBy });
      res.status(201).json(createResponse(true, 201, 'Module created', doc));
    } catch (e: any) {
      res.status(400).json(createResponse(false, 400, 'Error', null, { details: e.message }));
    }
  }

  /** GET lista */
  static async getAll(req: Request, res: Response) {
    const { classId, unitId } = req.params;
    const list = await ModuleService.getAll(classId, unitId);
    res.json(createResponse(true, 200, 'OK', list));
  }

  /** detalle */
  static async getById(req: Request, res: Response) {
    const { classId, unitId, moduleId } = req.params;
    const doc = await ModuleService.getById(classId, unitId, moduleId);
    doc
      ? res.json(createResponse(true, 200, 'OK', doc))
      : res.status(404).json(createResponse(false, 404, 'Not found'));
  }

  /** update */
  static async update(req: Request, res: Response) {
    const { classId, unitId, moduleId } = req.params;
    const doc = await ModuleService.update(classId, unitId, moduleId, req.body as UpdateModuleDTO);
    res.json(createResponse(true, 200, 'Updated', doc));
  }

  /** delete */
  static async delete(req: Request, res: Response) {
    const { classId, unitId, moduleId } = req.params;
    await ModuleService.delete(classId, unitId, moduleId);
    res.json(createResponse(true, 200, 'Deleted'));
  }
}
