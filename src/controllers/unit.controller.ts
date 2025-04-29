import { Request, Response } from 'express';
import { createResponse }    from '../utils/response.util';
import { UnitService }       from '../services/unit.service';
import { CreateUnitDTO, UpdateUnitDTO } from '../domain/dtos/unit.dto';

export class UnitController {

  /** POST /classes/:classId/units */
  static async create(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const dto = req.body as CreateUnitDTO;
      const createdBy = (req as any).userId;
      const doc = await UnitService.create(classId, { ...dto, createdBy });
      res.status(201).json(createResponse(true, 201, 'Unit created', doc));
    } catch (e:any) {
      res.status(400).json(createResponse(false, 400, 'Error', null, { details: e.message }));
    }
  }

  /** GET all units for class */
  static async getAll(req: Request, res: Response) {
    const { classId } = req.params;
    const list = await UnitService.getAll(classId);
    res.json(createResponse(true, 200, 'OK', list));
  }

  /** GET one */
  static async getById(req: Request, res: Response) {
    const { classId, unitId } = req.params;
    const doc = await UnitService.getById(classId, unitId);
    doc
      ? res.json(createResponse(true, 200, 'OK', doc))
      : res.status(404).json(createResponse(false, 404, 'Not found'));
  }

  /** PUT */
  static async update(req: Request, res: Response) {
    const { classId, unitId } = req.params;
    const doc = await UnitService.update(classId, unitId, req.body as UpdateUnitDTO);
    res.json(createResponse(true, 200, 'Updated', doc));
  }

  /** DELETE */
  static async delete(req: Request, res: Response) {
    const { classId, unitId } = req.params;
    await UnitService.delete(classId, unitId);
    res.json(createResponse(true, 200, 'Deleted'));
  }
}
