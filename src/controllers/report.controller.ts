import { Request, Response } from 'express';
import { createResponse }    from '../utils/response.util';
import { ReportService }     from '../services/report.service';

export class ReportController {

  /** GET /reports */
  static async get(req: Request, res: Response){
    const doc = await ReportService.get();
    doc
      ? res.json(createResponse(true,200,'OK',doc))
      : res.status(404).json(createResponse(false,404,'No report yet'));
  }

  /** POST /reports/rebuild  (solo admin) */
  static async rebuild(_:Request,res:Response){
    const doc = await ReportService.rebuild();
    res.status(201).json(createResponse(true,201,'Report rebuilt',doc));
  }
}
