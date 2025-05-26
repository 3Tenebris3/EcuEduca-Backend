import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { roleGuard } from "../middlewares/roleGuard.middleware";
import { TeacherPointsController } from "../controllers/teacherPoints.controller";

export const teacherPointsRouter = Router();

/* solo TEACHER o ADMIN */
teacherPointsRouter.use(jwtAuthMiddleware, roleGuard(...["teacher", "admin"]));

teacherPointsRouter.get ("/",        TeacherPointsController.list);
teacherPointsRouter.post("/adjust",  TeacherPointsController.adjust);
