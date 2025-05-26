import { Router } from "express";
import { QuickPickController } from "../controllers/quickpick.controller";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";

export const quickPickRouter = Router();

/* público: obtener el set */
quickPickRouter.get("/sets/:id", QuickPickController.getTheme);

/* protegido: enviar score */
quickPickRouter.post(
  "/submit",
  jwtAuthMiddleware,
  QuickPickController.submit
);
