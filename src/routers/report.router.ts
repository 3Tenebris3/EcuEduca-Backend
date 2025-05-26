/* src/routers/teacher/report.router.ts */
import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { roleGuard } from "../middlewares/roleGuard.middleware";

export const teacherReportRouter = Router();

teacherReportRouter.use(jwtAuthMiddleware, roleGuard("teacher"));

teacherReportRouter.get("/summary",  ReportController.summary);
teacherReportRouter.get("/students", ReportController.students);
