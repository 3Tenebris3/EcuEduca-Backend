import { Request, Response } from 'express';
import { createResponse } from '../utils/response.util';
import { NotificationService } from '../services/notification.service';

/**
 * Todas las rutas usan jwtAuthMiddleware → req.userId y req.userRole
 */
export class NotificationController {

  /**
   * @openapi
   * /notifications:
   *   get:
   *     summary: Lista todas las notificaciones del usuario autenticado
   *     tags: [Notificaciones]
   *     security: [ bearerAuth: [] ]
   *     responses:
   *       200:
   *         description: Lista de notificaciones
   */
  static async list(req: Request, res: Response) {
    const userId = (req as any).userId;
    const list = await NotificationService.getAll(userId);
    res.json(createResponse(true, 200, 'Ok', list));
  }

  /**
   * @openapi
   * /notifications/{id}:
   *   get:
   *     summary: Obtiene el detalle de una notificación
   *     tags: [Notificaciones]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID de la notificación
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Detalle de la notificación
   *       403:
   *         description: Acceso denegado (no eres el dueño ni tienes rol permitido)
   *       404:
   *         description: Notificación no encontrada
   */
  static async detail(req: Request, res: Response) {
    const n = await NotificationService.getById(req.params.id);
    if (!n) return res.status(404).json(createResponse(false,404,'Not found'));
    const role = (req as any).userRole;
    if (n.userId !== (req as any).userId && role !== 'admin' && role !== 'teacher')
      return res.status(403).json(createResponse(false,403,'Forbidden'));
    res.json(createResponse(true,200,'Ok',n));
  }

  /**
   * @openapi
   * /notifications:
   *   post:
   *     summary: Crea una nueva notificación (admin o teacher)
   *     tags: [Notificaciones]
   *     security: [ bearerAuth: [] ]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [userId, title, body]
   *             properties:
   *               userId:
   *                 type: string
   *               title:
   *                 type: string
   *               body:
   *                 type: string
   *     responses:
   *       201:
   *         description: Notificación creada
   *       403:
   *         description: Rol no autorizado
   */
  static async create(req: Request, res: Response) {
    const role = (req as any).userRole;
    if (role !== 'admin' && role !== 'teacher')
      return res.status(403).json(createResponse(false,403,'Forbidden'));
    const saved = await NotificationService.create({
      ...req.body,
      date: new Date(),
    });
    res.status(201).json(createResponse(true,201,'Created',saved));
  }

  /**
   * @openapi
   * /notifications/{id}/read:
   *   post:
   *     summary: Marca una notificación como leída
   *     tags: [Notificaciones]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID de la notificación
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Lista de notificaciones
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 code:
   *                   type: number
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/NotificationModel'
   */
  static async markRead(req: Request, res: Response) {
    await NotificationService.markRead(req.params.id);
    res.json(createResponse(true,200,'Updated'));
  }

  /**
   * @openapi
   * /notifications/{id}:
   *   delete:
   *     summary: Elimina una notificación (solo admin)
   *     tags: [Notificaciones]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID de la notificación
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Notificación eliminada
   *       403:
   *         description: Solo el administrador puede eliminar
   */
  static async remove(req: Request, res: Response) {
    const role = (req as any).userRole;
    if (role !== 'admin')
      return res.status(403).json(createResponse(false,403,'Forbidden'));
    await NotificationService.delete(req.params.id);
    res.json(createResponse(true,200,'Deleted'));
  }
}
