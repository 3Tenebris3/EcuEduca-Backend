import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { SceneController } from "../controllers/scene.controller";
import { roleGuard } from "../middlewares/roleGuard.middleware";

export const scenarioRouter = Router();

/* Todas requieren JWT (saber qué usuario completó) */
scenarioRouter.use(jwtAuthMiddleware);

scenarioRouter.get("/",        SceneController.list);
scenarioRouter.get("/:id",     SceneController.get);
scenarioRouter.post("/:id/done", SceneController.done);

/* solo admin puede crear/editar */
scenarioRouter.post(
  "/",
  roleGuard("admin"),
  SceneController.create
);
