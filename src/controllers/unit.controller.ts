import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { UnitService } from "../services/unit.service";
import { CreateUnitDTO, UpdateUnitDTO } from "../domain/dtos/unit.dto";

export class UnitController {
  /**
   * @openapi
   * /classes/{classId}/units:
   *   post:
   *     summary: Crear una nueva unidad en una clase
   *     tags: [Unidades]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: classId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUnitDTO'
   *     responses:
   *       201:
   *         description: Unidad creada exitosamente
   *       400:
   *         description: Error al crear la unidad
   */
  static async create(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const dto = req.body as CreateUnitDTO;
      const createdBy = (req as any).userId;
      const doc = await UnitService.create(classId, { ...dto, createdBy });
      res.status(201).json(createResponse(true, 201, "Unit created", doc));
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
   * /classes/{classId}/units:
   *   get:
   *     summary: Obtener todas las unidades de una clase
   *     tags: [Unidades]
   *     parameters:
   *       - name: classId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de unidades obtenida exitosamente
   */
  static async getAll(req: Request, res: Response) {
    const list = await UnitService.getAll(req.params.classId);
    res.json(createResponse(true, 200, "OK", list));
  }

  /**
   * @openapi
   * /classes/{classId}/units/{unitId}:
   *   get:
   *     summary: Obtener una unidad por su ID
   *     tags: [Unidades]
   *     parameters:
   *       - name: classId
   *         in: path
   *         required: true
   *         schema: { type: string }
   *       - name: unitId
   *         in: path
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Unidad encontrada
   *       404:
   *         description: Unidad no encontrada
   */
  static async getById(req: Request, res: Response) {
    const { classId, unitId } = req.params;
    const doc = await UnitService.getById(classId, unitId);
    doc
      ? res.json(createResponse(true, 200, "OK", doc))
      : res.status(404).json(createResponse(false, 404, "Not found"));
  }

  /**
   * @openapi
   * /classes/{classId}/units/{unitId}:
   *   put:
   *     summary: Actualizar una unidad
   *     tags: [Unidades]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: classId
   *         in: path
   *         required: true
   *       - name: unitId
   *         in: path
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUnitDTO'
   *     responses:
   *       200:
   *         description: Unidad actualizada
   */
  static async update(req: Request, res: Response) {
    const { classId, unitId } = req.params;
    const doc = await UnitService.update(
      classId,
      unitId,
      req.body as UpdateUnitDTO
    );
    res.json(createResponse(true, 200, "Updated", doc));
  }

  /**
   * @openapi
   * /classes/{classId}/units/{unitId}:
   *   delete:
   *     summary: Eliminar una unidad
   *     tags: [Unidades]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: classId
   *         in: path
   *         required: true
   *       - name: unitId
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Unidad eliminada
   */
  static async delete(req: Request, res: Response) {
    const { classId, unitId } = req.params;
    await UnitService.delete(classId, unitId);
    res.json(createResponse(true, 200, "Deleted"));
  }
}
