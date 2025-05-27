import { Router } from "express";
import { SceneController } from "../controllers/scene.controller";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { roleGuard } from "../middlewares/roleGuard.middleware";

export const scenarioRouter = Router();

/* Todas requieren JWT */
scenarioRouter.use(jwtAuthMiddleware);

/* ---------- alumno ---------- */
scenarioRouter.get("/", SceneController.list);
scenarioRouter.get("/:id", SceneController.get);
scenarioRouter.post("/:id/done", SceneController.done);

/* ---------- admin ---------- */
scenarioRouter.post("/", roleGuard("admin"), SceneController.create);
scenarioRouter.patch("/:id", roleGuard("admin"), SceneController.patch);
scenarioRouter.delete("/:id", roleGuard("admin"), SceneController.remove);
