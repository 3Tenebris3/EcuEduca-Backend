import { Request, Response } from 'express';
import { createResponse }     from '../utils/response.util';
import { MinigameService }    from '../services/minigame.service';
import { CreateMinigameDTO, UpdateMinigameDTO } from '../domain/dtos/minigame.dto';

export class MinigameController {

  /**
   * @openapi
   * /minigames:
   *   post:
   *     summary: Crea un nuevo minijuego
   *     tags: [Minijuegos]
   *     security: [ bearerAuth: [] ]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateMinigameDTO'
   *     responses:
   *       201:
   *         description: Minijuego creado exitosamente
   *       400:
   *         description: Error al crear el minijuego
   */
  static async create(req: Request, res: Response) {
    try {
      const dto = req.body as CreateMinigameDTO;
      const createdBy = (req as any).userId;
      const doc = await MinigameService.create({ ...dto, createdBy });
      res.status(201).json(createResponse(true, 201, 'Minigame created', doc));
    } catch (e:any) {
      res.status(400).json(createResponse(false, 400, 'Error', null, { details: e.message }));
    }
  }

  /**
   * @openapi
   * /minigames:
   *   get:
   *     summary: Obtiene todos los minijuegos
   *     tags: [Minijuegos]
   *     responses:
   *       200:
   *         description: Lista de minijuegos
   */
  static async getAll(_: Request, res: Response) {
    res.json(createResponse(true, 200, 'OK', await MinigameService.getAll()));
  }

  /**
   * @openapi
   * /minigames/{minigameId}:
   *   get:
   *     summary: Obtiene un minijuego por su ID
   *     tags: [Minijuegos]
   *     parameters:
   *       - name: minigameId
   *         in: path
   *         required: true
   *         description: ID del minijuego
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Minijuego encontrado
   *       404:
   *         description: Minijuego no encontrado
   */
  static async getById(req: Request, res: Response) {
    const doc = await MinigameService.getById(req.params.minigameId);
    doc
      ? res.json(createResponse(true, 200, 'OK', doc))
      : res.status(404).json(createResponse(false, 404, 'Not found'));
  }

  /**
   * @openapi
   * /minigames/{minigameId}:
   *   put:
   *     summary: Actualiza un minijuego por su ID
   *     tags: [Minijuegos]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: minigameId
   *         in: path
   *         required: true
   *         description: ID del minijuego
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateMinigameDTO'
   *     responses:
   *       200:
   *         description: Minijuego actualizado exitosamente
   */
  static async update(req: Request, res: Response) {
    const doc = await MinigameService.update(
      req.params.minigameId,
      req.body as UpdateMinigameDTO
    );
    res.json(createResponse(true, 200, 'Updated', doc));
  }

  /**
   * @openapi
   * /minigames/{minigameId}:
   *   delete:
   *     summary: Elimina un minijuego por su ID
   *     tags: [Minijuegos]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: minigameId
   *         in: path
   *         required: true
   *         description: ID del minijuego
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Minijuego eliminado exitosamente
   */
  static async delete(req: Request, res: Response) {
    await MinigameService.delete(req.params.minigameId);
    res.json(createResponse(true, 200, 'Deleted'));
  }
}
