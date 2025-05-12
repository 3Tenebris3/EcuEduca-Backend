import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { GroupService } from "../services/group.service";
import { CreateGroupDTO, UpdateGroupDTO } from "../domain/dtos/group.dto";

export class GroupController {
  /**
   * @openapi
   * /courses/{courseId}/groups:
   *   post:
   *     summary: Crear un nuevo grupo dentro de un curso
   *     tags: [Groups]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: courseId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "7°A"
   *     responses:
   *       201:
   *         description: Grupo creado exitosamente
   *       400:
   *         description: Error al crear el grupo
   */
  static async create(req: Request, res: Response) {
    try {
      const dto = req.body as Omit<CreateGroupDTO, "teacherId" | "courseId">;
      const { courseId } = req.params;
      const teacherId = (req as any).userId;
      const doc = await GroupService.create({
        ...dto,
        courseId,
        teacherId,
      });
      res.status(201).json(createResponse(true, 201, "Group created", doc));
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
   * /courses/{courseId}/groups:
   *   get:
   *     summary: Listar grupos de un curso asignado al profesor autenticado
   *     tags: [Groups]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: courseId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de grupos del curso
   */
  static async listByCourse(req: Request, res: Response) {
    const teacherId = (req as any).userId;
    const list = await GroupService.getByCourse(req.params.courseId, teacherId);
    res.json(createResponse(true, 200, "OK", list));
  }

  /**
   * @openapi
   * /groups/{groupId}:
   *   put:
   *     summary: Actualizar un grupo
   *     tags: [Groups]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: groupId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateGroupDTO'
   *     responses:
   *       200:
   *         description: Grupo actualizado
   */
  static async update(req: Request, res: Response) {
    const doc = await GroupService.update(
      req.params.groupId,
      req.body as UpdateGroupDTO
    );
    res.json(createResponse(true, 200, "Updated", doc));
  }

  /**
   * @openapi
   * /groups/{groupId}:
   *   delete:
   *     summary: Eliminar un grupo
   *     tags: [Groups]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: groupId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Grupo eliminado
   */
  static async delete(req: Request, res: Response) {
    await GroupService.delete(req.params.groupId);
    res.json(createResponse(true, 200, "Deleted"));
  }
}
