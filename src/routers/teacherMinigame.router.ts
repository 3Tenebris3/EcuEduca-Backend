import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { roleGuard } from "../middlewares/roleGuard.middleware";
import { TeacherMinigameController } from "../controllers/minigameTeacher.controller";

export const teacherMinigameRouter = Router();

teacherMinigameRouter.use(jwtAuthMiddleware, roleGuard("teacher"));

teacherMinigameRouter.get("/",      TeacherMinigameController.list);
teacherMinigameRouter.get("/:id",   TeacherMinigameController.detail);
