import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { CourseService } from "../services/course.service";
import { CreateCourseDTO, UpdateCourseDTO } from "../domain/dtos/course.dto";

export class CourseController {
  /**
   * @openapi
   * /courses:
   *   post:
   *     summary: Crear un nuevo curso
   *     tags: [Courses]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCourseDTO'
   *     responses:
   *       201:
   *         description: Curso creado exitosamente
   *       400:
   *         description: Error al crear el curso
   */

  static async create(req: Request, res: Response) {
    try {
      const dto = req.body as CreateCourseDTO;
      const createdBy = (req as any).userId;
      const doc = await CourseService.create({ ...dto, createdBy });
      res.status(201).json(createResponse(true, 201, "Course created", doc));
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
   * /courses:
   *   get:
   *     summary: Listar cursos creados por el profesor autenticado
   *     tags: [Courses]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de cursos
   */
  static async list(req: Request, res: Response) {
    const teacherId = (req as any).userId;
    const list = await CourseService.getAllByTeacher(teacherId);
    res.json(createResponse(true, 200, "OK", list));
  }

  /**
   * @openapi
   * /courses/{courseId}:
   *   get:
   *     summary: Obtener un curso por ID
   *     tags: [Courses]
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
   *         description: Curso encontrado
   *       404:
   *         description: Curso no encontrado
   */
  static async getById(req: Request, res: Response) {
    const doc = await CourseService.getById(req.params.courseId);
    doc
      ? res.json(createResponse(true, 200, "OK", doc))
      : res.status(404).json(createResponse(false, 404, "Not found"));
  }

  /**
   * @openapi
   * /courses/{courseId}:
   *   put:
   *     summary: Actualizar un curso
   *     tags: [Courses]
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
   *             $ref: '#/components/schemas/UpdateCourseDTO'
   *     responses:
   *       200:
   *         description: Curso actualizado
   */
  static async update(req: Request, res: Response) {
    const doc = await CourseService.update(
      req.params.courseId,
      req.body as UpdateCourseDTO
    );
    res.json(createResponse(true, 200, "Updated", doc));
  }

  /**
   * @openapi
   * /courses/{courseId}:
   *   delete:
   *     summary: Eliminar un curso
   *     tags: [Courses]
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
   *         description: Curso eliminado
   */
  static async delete(req: Request, res: Response) {
    await CourseService.delete(req.params.courseId);
    res.json(createResponse(true, 200, "Deleted"));
  }
}
