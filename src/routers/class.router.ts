import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { roleGuard } from "../middlewares/roleGuard.middleware";
import { ClassController } from "../controllers/class.controller";

export const teacherClassRouter = Router();

teacherClassRouter.use(jwtAuthMiddleware, roleGuard("teacher"));

teacherClassRouter.get("/", ClassController.listForTeacher);
