import { Request, Response } from 'express';
import { createResponse }    from '../utils/response.util';
import { ClassService }      from '../services/class.service';

export class AssignController {

  /* ----- estudiantes ----- */
  static async addStudent(req: Request, res: Response) {
    await ClassService.addStudent(req.params.cId, req.params.sId);
    res.json(createResponse(true, 200, 'Student added'));
  }

  static async removeStudent(req: Request, res: Response) {
    await ClassService.removeStudent(req.params.cId, req.params.sId);
    res.json(createResponse(true, 200, 'Student removed'));
  }

  /* ----- maestros ----- */
  static async addTeacher(req: Request, res: Response) {
    await ClassService.addTeacher(req.params.cId, req.params.tId);
    res.json(createResponse(true, 200, 'Teacher added'));
  }

  static async removeTeacher(req: Request, res: Response) {
    await ClassService.removeTeacher(req.params.cId, req.params.tId);
    res.json(createResponse(true, 200, 'Teacher removed'));
  }
}
