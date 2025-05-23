import { Router } from "express";
import { getLeaderboard } from "../controllers/leaderboard.controller";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";

export const leaderboardRouter = Router();

/* público: la tabla es de solo lectura */
leaderboardRouter.get("/", getLeaderboard);

/* privado: cuando un minijuego o quiz termina */
import * as service from "../services/leaderboard.service";
leaderboardRouter.post(
  "/add-points",
  jwtAuthMiddleware,
  async (req, res) => {
    const { delta } = req.body;           // { delta: 25 }
    if (typeof delta !== "number") return res.status(400).send("delta required");
    const { uid, name, avatar } = req.user!; // viene del token
    await service.updateUserPoints(uid, delta, name, avatar);
    res.sendStatus(204);
  }
);
