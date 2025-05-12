import { Request, Response } from 'express';
import { createResponse }    from '../utils/response.util';
import { ReportService }     from '../services/report.service';

export class ReportController {

  /**
   * @openapi
   * /reports:
   *   get:
   *     summary: Obtiene el reporte actual del sistema
   *     tags: [Reportes]
   *     security: [ bearerAuth: [] ]
   *     responses:
   *       200:
   *         description: Reporte encontrado
   *       404:
   *         description: Aún no se ha generado ningún reporte
   */
  static async get(req: Request, res: Response){
    const doc = await ReportService.get();
    doc
      ? res.json(createResponse(true,200,'OK',doc))
      : res.status(404).json(createResponse(false,404,'No report yet'));
  }

  /**
   * @openapi
   * /reports/rebuild:
   *   post:
   *     summary: Reconstruye el reporte del sistema (solo admin)
   *     tags: [Reportes]
   *     security: [ bearerAuth: [] ]
   *     responses:
   *       201:
   *         description: Reporte reconstruido exitosamente
   */
  static async rebuild(_:Request,res:Response){
    const doc = await ReportService.rebuild();
    res.status(201).json(createResponse(true,201,'Report rebuilt',doc));
  }
}
