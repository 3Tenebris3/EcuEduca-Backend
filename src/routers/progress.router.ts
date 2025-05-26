/* src/routers/progress.router.ts */
import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { ProgressController } from "../controllers/progress.controller";

export const progressRouter = Router();

progressRouter.use(jwtAuthMiddleware);

progressRouter.post("/scenario",  ProgressController.saveScenario);
progressRouter.post("/minigame",  ProgressController.saveMinigame);