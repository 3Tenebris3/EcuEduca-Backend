import { Router } from "express";
import { LeaderboardController } from "../controllers/leaderboard.controller";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";

export const leaderboardRouter = Router();

/* pública: lista top-100 */
leaderboardRouter.get("/", LeaderboardController.list);

/* protegida: sumar puntos */
leaderboardRouter.post(
  "/add",
  jwtAuthMiddleware,
  LeaderboardController.addPoints
);
