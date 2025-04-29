import { Request, Response } from 'express';
import { createResponse }    from '../utils/response.util';
import { ScenarioService }   from '../services/scenario.service';
import { CreateScenarioDTO, UpdateScenarioDTO, CreatePointDTO, UpdatePointDTO } from '../domain/dtos/scenario.dto';

export class ScenarioController {
  /* ----- escenarios base ----- */
  static async create(req: Request, res: Response) {
    try {
      const dto = req.body as CreateScenarioDTO;
      const createdBy = (req as any).userId;
      const doc = await ScenarioService.create({ ...dto, createdBy });
      res.status(201).json(createResponse(true,201,'Scenario created',doc));
    } catch(e:any){
      res.status(400).json(createResponse(false,400,'Error',null,{details:e.message}));
    }
  }
  static async getAll(_:Request,res:Response){
    res.json(createResponse(true,200,'OK',await ScenarioService.getAll()));
  }
  static async getById(req:Request,res:Response){
    const doc=await ScenarioService.getById(req.params.scenarioId);
    doc ? res.json(createResponse(true,200,'OK',doc))
        : res.status(404).json(createResponse(false,404,'Not found'));
  }
  static async update(req:Request,res:Response){
    const doc=await ScenarioService.update(req.params.scenarioId, req.body as UpdateScenarioDTO);
    res.json(createResponse(true,200,'Updated',doc));
  }
  static async delete(req:Request,res:Response){
    await ScenarioService.delete(req.params.scenarioId);
    res.json(createResponse(true,200,'Deleted'));
  }

  /* ----- puntos de interés ----- */
  static async addPoint(req:Request,res:Response){
    const doc = await ScenarioService.createPoint(req.params.scenarioId, req.body as CreatePointDTO);
    res.status(201).json(createResponse(true,201,'Point added',doc));
  }
  static async listPoints(req:Request,res:Response){
    const list = await ScenarioService.getPoints(req.params.scenarioId);
    res.json(createResponse(true,200,'OK',list));
  }
  static async updatePoint(req:Request,res:Response){
    const doc = await ScenarioService.updatePoint(
      req.params.scenarioId, req.params.pointId, req.body as UpdatePointDTO);
    res.json(createResponse(true,200,'Updated',doc));
  }
  static async deletePoint(req:Request,res:Response){
    await ScenarioService.deletePoint(req.params.scenarioId, req.params.pointId);
    res.json(createResponse(true,200,'Deleted'));
  }
}
