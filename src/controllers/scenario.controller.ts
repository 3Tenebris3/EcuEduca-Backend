import { Request, Response } from 'express';
import { createResponse }    from '../utils/response.util';
import { ScenarioService }   from '../services/scenario.service';
import { CreateScenarioDTO, UpdateScenarioDTO, CreatePointDTO, UpdatePointDTO } from '../domain/dtos/scenario.dto';

export class ScenarioController {
  /* ----- escenarios base ----- */
    /**
   * @openapi
   * /scenarios:
   *   post:
   *     summary: Crea un nuevo escenario
   *     tags: [Escenarios]
   *     security: [ bearerAuth: [] ]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateScenarioDTO'
   *     responses:
   *       201:
   *         description: Escenario creado exitosamente
   *       400:
   *         description: Error en los datos enviados
   */
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
  
    /**
     * @openapi
     * /scenarios:
     *   get:
     *     summary: Lista todos los escenarios
     *     tags: [Escenarios]
     *     responses:
     *       200:
     *         description: Reporte encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 code:
     *                   type: number
     *                   example: 200
     *                 message:
     *                   type: string
     *                   example: OK
     *                 data:
     *                   $ref: '#/components/schemas/ReportDTO'
     *       404:
     *         description: Aún no se ha generado ningún reporte
     */
  static async getAll(_:Request,res:Response){
    res.json(createResponse(true,200,'OK',await ScenarioService.getAll()));
  }
  
    /**
   * @openapi
   * /scenarios/{scenarioId}:
   *   get:
   *     summary: Obtiene un escenario por ID
   *     tags: [Escenarios]
   *     parameters:
   *       - name: scenarioId
   *         in: path
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200: { description: Escenario encontrado }
   *       404: { description: Escenario no encontrado }
   */
  static async getById(req:Request,res:Response){
    const doc=await ScenarioService.getById(req.params.scenarioId);
    doc ? res.json(createResponse(true,200,'OK',doc))
        : res.status(404).json(createResponse(false,404,'Not found'));
  }
  
    /**
   * @openapi
   * /scenarios/{scenarioId}:
   *   put:
   *     summary: Actualiza un escenario
   *     tags: [Escenarios]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: scenarioId
   *         in: path
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateScenarioDTO'
   *     responses:
   *       200: { description: Escenario actualizado }
   */
  static async update(req:Request,res:Response){
    const doc=await ScenarioService.update(req.params.scenarioId, req.body as UpdateScenarioDTO);
    res.json(createResponse(true,200,'Updated',doc));
  }
  
    /**
   * @openapi
   * /scenarios/{scenarioId}:
   *   delete:
   *     summary: Elimina un escenario
   *     tags: [Escenarios]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: scenarioId
   *         in: path
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200: { description: Escenario eliminado }
   */
  static async delete(req:Request,res:Response){
    await ScenarioService.delete(req.params.scenarioId);
    res.json(createResponse(true,200,'Deleted'));
  }

  /* ----- puntos de interés ----- */
    /**
   * @openapi
   * /scenarios/{scenarioId}/points:
   *   post:
   *     summary: Agrega un punto de interés al escenario
   *     tags: [Puntos de Interés]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: scenarioId
   *         in: path
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreatePointDTO'
   *     responses:
   *       201: { description: Punto agregado }
   */
  static async addPoint(req:Request,res:Response){
    const doc = await ScenarioService.createPoint(req.params.scenarioId, req.body as CreatePointDTO);
    res.status(201).json(createResponse(true,201,'Point added',doc));
  }
  
    /**
   * @openapi
   * /scenarios/{scenarioId}/points:
   *   get:
   *     summary: Lista todos los puntos de interés del escenario
   *     tags: [Puntos de Interés]
   *     parameters:
   *       - name: scenarioId
   *         in: path
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200: { description: Lista de puntos }
   */
  static async listPoints(req:Request,res:Response){
    const list = await ScenarioService.getPoints(req.params.scenarioId);
    res.json(createResponse(true,200,'OK',list));
  }
  
    /**
   * @openapi
   * /scenarios/{scenarioId}/points/{pointId}:
   *   put:
   *     summary: Actualiza un punto de interés
   *     tags: [Puntos de Interés]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: scenarioId
   *         in: path
   *         required: true
   *       - name: pointId
   *         in: path
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdatePointDTO'
   *     responses:
   *       200: { description: Punto actualizado }
   */
  static async updatePoint(req:Request,res:Response){
    const doc = await ScenarioService.updatePoint(
      req.params.scenarioId, req.params.pointId, req.body as UpdatePointDTO);
    res.json(createResponse(true,200,'Updated',doc));
  }
  
    /**
   * @openapi
   * /scenarios/{scenarioId}/points/{pointId}:
   *   delete:
   *     summary: Elimina un punto de interés
   *     tags: [Puntos de Interés]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: scenarioId
   *         in: path
   *         required: true
   *       - name: pointId
   *         in: path
   *         required: true
   *     responses:
   *       200: { description: Punto eliminado }
   */
  static async deletePoint(req:Request,res:Response){
    await ScenarioService.deletePoint(req.params.scenarioId, req.params.pointId);
    res.json(createResponse(true,200,'Deleted'));
  }
}
