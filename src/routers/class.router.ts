import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { roleGuard } from "../middlewares/roleGuard.middleware";
import { ClassController } from "../controllers/class.controller";

export const classRouter = Router();

/* ---------- ADMIN ONLY CRUD ---------- */
classRouter.use(jwtAuthMiddleware, roleGuard("admin"));

classRouter.get("/",            ClassController.list);
classRouter.post("/",           ClassController.create);
classRouter.get("/:id",         ClassController.get);
classRouter.patch("/:id",       ClassController.update);
classRouter.delete("/:id",      ClassController.remove);

/* enroll / remove student */
classRouter.post("/enroll",     ClassController.enroll);

/* ---------- (opcional) para docentes ---------- */
/* Si decides exponerlo, monta en index.ts:    
      app.use("/teacher/classes", teacherClassRouter);
*/
export const teacherClassRouter = Router();
teacherClassRouter.use(jwtAuthMiddleware, roleGuard("teacher"));
teacherClassRouter.get("/",      ClassController.listForTeacher);
