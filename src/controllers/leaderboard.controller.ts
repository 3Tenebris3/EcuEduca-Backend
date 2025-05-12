import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { getRankingForTeacher } from "../services/leaderboard.service";

export class LeaderboardController {
  /**
 * @openapi
 * /leaderboard/mine:
 *   get:
 *     summary: Obtener ranking de los estudiantes de mis grupos
 *     tags: [Leaderboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ranking obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     rows:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LeaderboardRow'
 */
  static async leaderboardMine(req: Request, res: Response) {
    const teacherId = (req as any).userId; // asume rol=teacher
    const data = await getRankingForTeacher(teacherId);
    res.json(createResponse(true, 200, "OK", { rows: data }));
  }
}
