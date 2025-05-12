import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { ModuleService } from "../services/module.service";
import { CreateModuleDTO, UpdateModuleDTO } from "../domain/dtos/module.dto";

export class ModuleController {
  /**
   * @openapi
   * /classes/{classId}/units/{unitId}/modules:
   *   post:
   *     summary: Crear un nuevo módulo dentro de una unidad
   *     tags: [Módulos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: classId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: unitId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateModuleDTO'
   *     responses:
   *       201:
   *         description: Módulo creado exitosamente
   *       400:
   *         description: Error al crear el módulo
   */
  static async create(req: Request, res: Response) {
    try {
      const { classId, unitId } = req.params;
      const dto = req.body as CreateModuleDTO;
      const createdBy = (req as any).userId;
      const doc = await ModuleService.create(classId, unitId, {
        ...dto,
        createdBy,
      });
      res.status(201).json(createResponse(true, 201, "Module created", doc));
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
   * /classes/{classId}/units/{unitId}/modules:
   *   get:
   *     summary: Obtener todos los módulos de una unidad
   *     tags: [Módulos]
   *     parameters:
   *       - name: classId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: unitId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de módulos obtenida exitosamente
   */
  static async getAll(req: Request, res: Response) {
    const { classId, unitId } = req.params;
    const list = await ModuleService.getAll(classId, unitId);
    res.json(createResponse(true, 200, "OK", list));
  }

  /**
   * @openapi
   * /classes/{classId}/units/{unitId}/modules/{moduleId}:
   *   get:
   *     summary: Obtener un módulo por su ID
   *     tags: [Módulos]
   *     parameters:
   *       - name: classId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: unitId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: moduleId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Módulo encontrado
   *       404:
   *         description: Módulo no encontrado
   */
  static async getById(req: Request, res: Response) {
    const { classId, unitId, moduleId } = req.params;
    const doc = await ModuleService.getById(classId, unitId, moduleId);
    doc
      ? res.json(createResponse(true, 200, "OK", doc))
      : res.status(404).json(createResponse(false, 404, "Not found"));
  }

  /**
   * @openapi
   * /classes/{classId}/units/{unitId}/modules/{moduleId}:
   *   put:
   *     summary: Actualizar un módulo por su ID
   *     tags: [Módulos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: classId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: unitId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: moduleId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateModuleDTO'
   *     responses:
   *       200:
   *         description: Módulo actualizado
   */
  static async update(req: Request, res: Response) {
    const { classId, unitId, moduleId } = req.params;
    const doc = await ModuleService.update(
      classId,
      unitId,
      moduleId,
      req.body as UpdateModuleDTO
    );
    res.json(createResponse(true, 200, "Updated", doc));
  }

  /**
   * @openapi
   * /classes/{classId}/units/{unitId}/modules/{moduleId}:
   *   delete:
   *     summary: Eliminar un módulo por su ID
   *     tags: [Módulos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: classId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: unitId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: moduleId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Módulo eliminado
   */
  static async delete(req: Request, res: Response) {
    const { classId, unitId, moduleId } = req.params;
    await ModuleService.delete(classId, unitId, moduleId);
    res.json(createResponse(true, 200, "Deleted"));
  }
}
