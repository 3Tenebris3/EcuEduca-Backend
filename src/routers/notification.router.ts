// src/routers/notification.router.ts
import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { NotificationController } from "../controllers/notification.controller";

export const notificationRouter = Router();

notificationRouter.get("/", jwtAuthMiddleware, NotificationController.list);
notificationRouter.post("/", jwtAuthMiddleware, NotificationController.create);
notificationRouter.delete(
  "/:id",
  jwtAuthMiddleware,
  NotificationController.remove
);
