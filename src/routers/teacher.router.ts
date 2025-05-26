/* src/routers/teacher.router.ts */
import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { TeacherController } from "../controllers/teacher.controller";
import { roleGuard } from "../middlewares/roleGuard.middleware";
import { teacherReportRouter } from "./report.router";
import { teacherClassRouter } from "./class.router";
import { teacherMinigameRouter } from "./teacherMinigame.router";

export const teacherRouter = Router();

teacherRouter.use(jwtAuthMiddleware, roleGuard("teacher", "admin"));

teacherRouter.get("/scenarios",      TeacherController.scenarioSummary);
teacherRouter.get("/minigames",      TeacherController.minigameSummary);
teacherRouter.get("/students/points",TeacherController.pointsSummary);

teacherRouter.use("/reports", teacherReportRouter);
teacherRouter.use("/classes", teacherClassRouter); 

teacherRouter.use("/minigames", teacherMinigameRouter);