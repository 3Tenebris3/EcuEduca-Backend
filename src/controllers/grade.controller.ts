import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { GradeService } from "../services/grade.service";
import { CreateGradeDTO, GradeQuery } from "../domain/dtos/grade.dto";

export class GradeController {
  /**
   * @openapi
   * /grades:
   *   post:
   *     summary: Registrar una nueva calificación
   *     tags: [Grades]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateGradeDTO'
   *     responses:
   *       201:
   *         description: Calificación registrada exitosamente
   *       400:
   *         description: Error al registrar la calificación
   */
  static async create(req: Request, res: Response) {
    try {
      const dto = req.body as CreateGradeDTO;
      const doc = await GradeService.create(dto);
      res.status(201).json(createResponse(true, 201, "Grade saved", doc));
    } catch (e: any) {
      res
        .status(400)
        .json(
          createResponse(false, 400, "Error", null, { details: e.message })
        );
    }
  }

  /**
   * @openapi
   * /grades:
   *   get:
   *     summary: Listar calificaciones filtradas por grupo, unidad o usuario
   *     tags: [Grades]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: groupId
   *         schema:
   *           type: string
   *         required: false
   *       - in: query
   *         name: unitId
   *         schema:
   *           type: string
   *         required: false
   *       - in: query
   *         name: userId
   *         schema:
   *           type: string
   *         required: false
   *       - in: query
   *         name: classId
   *         schema:
   *           type: string
   *         required: false
   *         deprecated: true
   *     responses:
   *       200:
   *         description: Lista de calificaciones obtenida exitosamente
   */
  static async list(req: Request, res: Response) {
    const list = await GradeService.list(req.query as GradeQuery);
    res.json(createResponse(true, 200, "OK", list));
  }
}
